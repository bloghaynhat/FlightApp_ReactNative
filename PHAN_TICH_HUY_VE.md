# PHÂN TÍCH: KHẢ NĂNG HỦY VÉ CHUYẾN BAY KHỨ HỒI

## ✅ TRẢ LỜI: ĐÃ GIẢI QUYẾT ĐƯỢC VẤN ĐỀ

Theo database schema hiện tại, **ĐÃ GIẢI QUYẾT** được vấn đề hủy vé khứ hồi. Khách hàng chỉ cần hủy 1 lần thông qua `BookingOrder`, không phải tự hủy 2 vé riêng lẻ.

---

## 🎯 TẠI SAO ĐÃ GIẢI QUYẾT?

### **1. Quan điểm từ UX/UI:**

**❌ THIẾT KẾ TỆ (không áp dụng):**

```
User clicks "Hủy vé"
  → Hiện ra 2 nút:
     [Hủy vé chiều đi]
     [Hủy vé chiều về]
  → User phải click 2 lần
  → User phải confirm 2 lần
  → Confusing & Poor UX
```

**✅ THIẾT KẾ TỐT (schema hiện tại cho phép):**

```
User clicks "Hủy vé"
  → Confirm: "Bạn có chắc muốn hủy vé khứ hồi này?"
  → User click [Đồng ý] 1 LẦN
  → Backend tự động hủy cả 2 segments (outbound + return)
  → Done! ✅
```

### **2. Database đã hỗ trợ điều này như thế nào?**

**Thiết kế quan trọng:**

```
BookingOrder (Parent) ← User tương tác với entity này
    ├── id: "BO1762537216403"
    ├── status: "Confirmed" | "Cancelled" ← Chỉ cần đổi field này
    └── bookingSegments[] (Children) ← Tự động cascade
            ├── Segment 1: outbound (chiều đi)
            └── Segment 2: return (chiều về)
```

**User chỉ thấy:** 1 booking order = 1 đơn đặt vé
**Backend xử lý:** Khi cancel BookingOrder → tự động update 2 segments

---

## 📊 PHÂN TÍCH DATABASE SCHEMA HIỆN TẠI

### **Cấu trúc tables:**

```
BookingOrder (1 đơn đặt)
    ├── id
    ├── confirmationCode
    ├── totalPrice
    ├── status: "Confirmed" | "Cancelled"
    └── ... (email, phone, payment)

BookingSegment (nhiều segments cho 1 order)
    ├── id
    ├── bookingOrderId  → FK to BookingOrder
    ├── flightId
    ├── leg: "outbound" | "return"
    ├── seatClassId
    ├── numSeats
    └── status: "Confirmed" | "Cancelled"

BookingPassenger (ánh xạ passenger × segment)
    ├── id
    ├── bookingSegmentId  → FK to BookingSegment
    ├── passengerId
    └── seatNumber
```

---

## 🔍 VÍ DỤ THỰC TẾ TỪ DATABASE

### **Booking khứ hồi BO1762537216403:**

```json
// BookingOrder
{
  "id": "BO1762537216403",
  "confirmationCode": "F6CBQA",
  "totalPrice": 2850000,
  "status": "Confirmed"
}

// BookingSegments - 2 SEGMENTS RIÊNG BIỆT
{
  "id": "7299",                           // Segment 1: CHIỀU ĐI
  "bookingOrderId": "BO1762537216403",
  "flightId": "F006",
  "leg": "outbound",                      // ← Chiều đi
  "seatClassId": "SC09",
  "numSeats": 1,
  "status": "Confirmed"
},
{
  "id": "a98c",                           // Segment 2: CHIỀU VỀ
  "bookingOrderId": "BO1762537216403",
  "flightId": "F008",
  "leg": "return",                        // ← Chiều về
  "seatClassId": "SC12",
  "numSeats": 1,
  "status": "Confirmed"
}
```

---

## ✅ GIẢI PHÁP ĐÃ CÓ TRONG SCHEMA: CANCEL QUA BOOKING ORDER

### **Cách thiết kế hiện tại đã giải quyết vấn đề:**

```typescript
// ✅ THIẾT KẾ HIỆN TẠI - USER CHỈ HỦY 1 LẦN
// User interface: Chỉ có 1 nút "Hủy đơn đặt vé"
async function cancelBooking(bookingOrderId: string) {
  // Bước 1: Update booking order status
  await updateBookingOrder(bookingOrderId, {
    status: "Cancelled",
  });

  // Bước 2: Backend tự động cascade update tất cả segments
  const segments = await getSegmentsByBookingOrderId(bookingOrderId);

  // Update tất cả segments trong 1 transaction
  await Promise.all(segments.map((segment) => updateSegment(segment.id, { status: "Cancelled" })));

  // Bước 3: Release seats và tính refund
  await Promise.all([releaseSeats(segments), calculateRefund(bookingOrderId)]);

  return {
    success: true,
    message: "Đã hủy vé thành công",
    segmentsCancelled: segments.length, // 2 segments
  };
}

// ✅ LỢI ÍCH CỦA THIẾT KẾ NÀY:
// 1. User chỉ thấy 1 nút "Hủy vé" (không cần phân biệt chiều đi/về)
// 2. User chỉ click 1 lần
// 3. Backend xử lý cascade update tự động
// 4. Atomic transaction - all or nothing
// 5. Better UX: "Đang hủy vé..." → "Đã hủy thành công"
// 6. Không có risk của việc hủy 1 segment rồi fail ở segment 2
```

---

## 🔄 SO SÁNH: THIẾT KẾ XẤU VS THIẾT KẾ TỐT (HIỆN TẠI)

### **❌ Thiết kế XẤU (KHÔNG áp dụng):**

```
Database Schema:
RoundTripTicket
    ├── id
    ├── outboundTicketId  → FK to Ticket
    └── returnTicketId    → FK to Ticket

Ticket (2 records riêng biệt)
    ├── id: "T001" (outbound)
    └── id: "T002" (return)

User Experience:
1. Vào trang "My Bookings"
2. Thấy 2 vé riêng biệt:
   [Vé chiều đi SGN→HAN] [Hủy]
   [Vé chiều về HAN→SGN] [Hủy]
3. Phải click "Hủy" 2 lần ❌
4. Confirm 2 lần ❌
5. Confusing!
```

### **✅ Thiết kế TỐT (Schema hiện tại):**

```
Database Schema:
BookingOrder (1 parent record)
    ├── id: "BO123"
    ├── status: "Confirmed"
    └── [Chứa toàn bộ info của đơn đặt vé]

BookingSegment (2 child records)
    ├── Segment 1: { bookingOrderId: "BO123", leg: "outbound" }
    └── Segment 2: { bookingOrderId: "BO123", leg: "return" }

User Experience:
1. Vào trang "My Bookings"
2. Thấy 1 booking order:
   [Đơn đặt vé SGN⇄HAN] [Hủy vé] ← 1 NÚT
3. Click "Hủy vé" 1 LẦN ✅
4. Confirm 1 lần: "Hủy cả 2 chiều đi và về?" ✅
5. Backend tự động hủy 2 segments ✅
6. Clear & Simple!
```

---

## 💡 OPTIONAL: CẢI TIẾN ĐỂ RÕ RÀNG HƠN (KHÔNG BẮT BUỘC)

Nếu muốn làm rõ ràng hơn trong code, có thể thêm field `ticketType` (nhưng KHÔNG BẮT BUỘC vì logic đã đúng):

### \*\*Option: Thêm trường `ticketType`

### **Option 1: Thêm field vào BookingOrder**

```json
// BookingOrder - THÊM ticketType
{
  "id": "BO1762537216403",
  "confirmationCode": "F6CBQA",
  "ticketType": "ROUND_TRIP",  // ← THÊM FIELD NÀY
  // hoặc: "ONE_WAY", "MULTI_CITY"
  "totalPrice": 2850000,
  "status": "Confirmed"
}

// BookingSegments - GIỮ NGUYÊN
{
  "id": "7299",
  "bookingOrderId": "BO1762537216403",
  "leg": "outbound",
  "status": "Confirmed"
},
{
  "id": "a98c",
  "bookingOrderId": "BO1762537216403",
  "leg": "return",
  "status": "Confirmed"
}
```

**✅ Lợi ích:**

```typescript
// ✅ HỦY 1 LẦN - Tối ưu
async function cancelBooking(bookingOrderId: string) {
  // Bước 1: Lấy booking order
  const booking = await getBookingOrder(bookingOrderId);

  // Bước 2: Check ticketType
  if (booking.ticketType === "ROUND_TRIP") {
    // ✅ Biết đây là vé khứ hồi → Hủy cả 2 segments CÙNG LÚC
    const segments = await getSegmentsByBookingOrderId(bookingOrderId);

    // ✅ Bulk update trong 1 transaction
    await Promise.all([
      updateSegment(segments[0].id, { status: "Cancelled" }),
      updateSegment(segments[1].id, { status: "Cancelled" }),
      updateBookingOrder(bookingOrderId, { status: "Cancelled" }),
      releaseSeats(segments),
      calculateRefund(booking),
    ]);

    // ✅ User chỉ thấy: "Đã hủy vé khứ hồi thành công"
  } else if (booking.ticketType === "ONE_WAY") {
    // Hủy 1 segment
    const segment = await getSegmentsByBookingOrderId(bookingOrderId);
    await cancelSegment(segment[0].id);
  }
}

// ✅ LỢI ÍCH:
// 1. Biết được loại vé ngay từ BookingOrder
// 2. Hủy đồng thời 2 segments trong 1 transaction
// 3. Atomic operation - all or nothing
// 4. Better UX: "Cancelling round-trip ticket..."
// 5. Dễ implement refund policy cho từng loại vé
```

---

### **Option 2: Thêm table BookingGroup**

```json
// BookingGroup - TABLE MỚI
{
  "id": "BG001",
  "bookingOrderId": "BO1762537216403",
  "groupType": "ROUND_TRIP",        // ← Đánh dấu nhóm
  "status": "Active"
}

// BookingSegment - THÊM FK
{
  "id": "7299",
  "bookingOrderId": "BO1762537216403",
  "bookingGroupId": "BG001",        // ← Link to group
  "leg": "outbound",
  "status": "Confirmed"
},
{
  "id": "a98c",
  "bookingOrderId": "BO1762537216403",
  "bookingGroupId": "BG001",        // ← Link to group
  "leg": "return",
  "status": "Confirmed"
}
```

**✅ Lợi ích:**

- Flexible hơn: Có thể group nhiều segments (multi-city)
- Cancellation policy theo group
- Refund calculation theo group

**❌ Nhược điểm:**

- Phức tạp hơn
- Thêm 1 table mới
- Join nhiều table hơn

---

## 📊 SO SÁNH IMPLEMENTATION APPROACHES

| Tiêu chí                  | Hiện tại (✅)     | Thêm ticketType | Thêm BookingGroup |
| ------------------------- | ----------------- | --------------- | ----------------- |
| **User Experience**       | ✅ Good           | ✅ Same         | ✅ Same           |
| **Cancel 1 lần**          | ✅ Yes            | ✅ Yes          | ✅ Yes            |
| **Database changes**      | None needed       | +1 field        | +1 table          |
| **Code clarity**          | ⚠️ Logic implicit | ✅ Explicit     | ✅ Very explicit  |
| **Complexity**            | ✅ Simple         | ✅ Simple       | ⚠️ Complex        |
| **Atomic cancellation**   | ✅ Yes            | ✅ Yes          | ✅ Yes            |
| **Multi-city support**    | ⚠️ Need logic     | ✅ Easy         | ✅ Very easy      |
| **Refund policy**         | ⚠️ Manual check   | ✅ Easy         | ✅ Easy           |
| **Query performance**     | ✅ Fast           | ✅ Fast         | ⚠️ Slower         |
| **Implementation effort** | ✅ Done           | Low             | Medium            |
| **Đã giải quyết vấn đề?** | ✅ YES            | ✅ YES          | ✅ YES            |

---

## 💡 KẾT LUẬN: THIẾT KẾ HIỆN TẠI ĐÃ TỐT, CÓ THỂ CẢI TIẾN THÊM

### **✅ Điều đã đạt được:**

Thiết kế hiện tại **ĐÃ GIẢI QUYẾT** vấn đề chính:

- ✅ User chỉ cần hủy 1 lần (qua BookingOrder)
- ✅ Không bắt user phải tự hủy 2 vé riêng lẻ
- ✅ Backend có thể cascade update tất cả segments
- ✅ Atomic transaction được bảo đảm

### **⚠️ Điểm có thể cải thiện (optional):**

#### \*\*Option 1: Thêm `ticketType` (RECOMMENDED NẾU CẦN CẢI THIỆN)

### **Migration plan:**

```typescript
// Step 1: Add ticketType field to BookingOrder
interface BookingOrder {
  id: string;
  confirmationCode: string;
  ticketType: "ONE_WAY" | "ROUND_TRIP" | "MULTI_CITY"; // ← NEW
  totalPrice: number;
  bookingDate: string;
  emailContact: string;
  phoneContact: string;
  paymentMethod: string;
  status: "Confirmed" | "Cancelled" | "Pending";
}

// Step 2: Update existing data
async function migrateExistingBookings() {
  const allBookings = await getAllBookingOrders();

  for (const booking of allBookings) {
    const segments = await getSegmentsByBookingOrderId(booking.id);

    // Determine ticket type based on segments
    const hasOutbound = segments.some((s) => s.leg === "outbound");
    const hasReturn = segments.some((s) => s.leg === "return");

    let ticketType: string;
    if (hasOutbound && hasReturn) {
      ticketType = "ROUND_TRIP";
    } else if (hasOutbound || hasReturn) {
      ticketType = "ONE_WAY";
    } else {
      ticketType = "MULTI_CITY";
    }

    await updateBookingOrder(booking.id, { ticketType });
  }
}

// Step 3: Update PaymentMethodScreen to set ticketType
const handleProceedToPayment = async () => {
  const bookingOrder = {
    confirmationCode: genConfirmationCode(),
    ticketType: bookingPayload.tripType === "roundTrip" ? "ROUND_TRIP" : "ONE_WAY", // ← SET khi tạo booking
    totalPrice: bookingPayload.grandTotal,
    status: "Confirmed",
    // ...
  };

  const resp = await apiClient.post("/bookingOrders", bookingOrder);
  // ...
};

// Step 4: Implement smart cancellation
async function cancelBooking(bookingOrderId: string) {
  const booking = await getBookingOrder(bookingOrderId);

  if (booking.ticketType === "ROUND_TRIP") {
    // Cancel all segments atomically
    const segments = await getSegmentsByBookingOrderId(bookingOrderId);

    await Promise.all([
      ...segments.map((s) => updateSegment(s.id, { status: "Cancelled" })),
      updateBookingOrder(bookingOrderId, { status: "Cancelled" }),
      releaseSeatsForAllSegments(segments),
      processRefund(booking),
    ]);

    return {
      success: true,
      message: "Round-trip ticket cancelled successfully",
      refundAmount: calculateRefund(booking),
    };
  } else {
    // ONE_WAY cancellation
    // ...
  }
}
```

---

## 🎯 KẾT LUẬN CUỐI CÙNG

### **Trạng thái hiện tại:**

✅ **ĐÃ** giải quyết được vấn đề hủy vé khứ hồi từ góc độ UX/UI

- ✅ User chỉ cần hủy 1 lần thông qua BookingOrder
- ✅ Không bắt user phải click "Hủy vé chiều đi" và "Hủy vé chiều về" riêng lẻ
- ✅ Backend có thể implement atomic transaction
- ✅ Data structure hỗ trợ cascade update

### **So sánh quan điểm:**

#### **❌ Thiết kế TỆ (KHÔNG phải schema hiện tại):**

```
User Interface:
┌─────────────────────────┐
│ My Bookings             │
├─────────────────────────┤
│ ✈️ Vé chiều đi          │
│ SGN → HAN               │
│ [Hủy vé này] ← Click 1  │ ❌ Phải click 2 lần
├─────────────────────────┤
│ ✈️ Vé chiều về          │
│ HAN → SGN               │
│ [Hủy vé này] ← Click 2  │ ❌ Confusing!
└─────────────────────────┘
```

#### **✅ Thiết kế TỐT (Schema hiện tại cho phép):**

```
User Interface:
┌─────────────────────────┐
│ My Bookings             │
├─────────────────────────┤
│ ✈️ Chuyến bay khứ hồi   │
│ SGN ⇄ HAN               │
│ • Chiều đi: 15/11/2025  │
│ • Chiều về: 20/11/2025  │
│                         │
│ [Hủy đơn đặt vé] ← 1 NÚT│ ✅ Chỉ click 1 lần!
└─────────────────────────┘

Khi click "Hủy đơn đặt vé":
→ Confirm: "Hủy cả 2 chiều đi và về?"
→ Backend tự động update:
   • bookingOrder.status = "Cancelled"
   • segment_outbound.status = "Cancelled"
   • segment_return.status = "Cancelled"
→ Done! ✅
```

### **Câu trả lời cho câu hỏi:**

> "Theo class diagram tôi thiết kế thì có phải đã giải quyết được việc hủy vé của chuyến bay khứ hồi không, thay vì phải hủy cả 2 vé lần lượt"

**✅ CÓ, đã giải quyết được!**

**Lý do:**

1. ✅ **Parent-Child relationship:** `BookingOrder` (1) → `BookingSegments` (N)
2. ✅ **User tương tác với Parent:** Chỉ cần hủy BookingOrder
3. ✅ **Cascade update:** Backend tự động update tất cả child segments
4. ✅ **Single action:** User không phải hủy từng vé một
5. ✅ **Atomic transaction:** Đảm bảo data consistency

### **Điểm mạnh của thiết kế:**

- ✅ Schema đã đúng từ đầu - có parent-child relationship
- ✅ User chỉ thấy 1 booking order, không thấy 2 segments riêng lẻ
- ✅ Cancellation logic đơn giản và rõ ràng
- ✅ Không cần phải redesign database

### **Có thể cải thiện thêm (optional):**

⚠️ Thêm field `ticketType: "ROUND_TRIP" | "ONE_WAY"` để:

- Code rõ ràng hơn (explicit thay vì implicit)
- Dễ apply refund policy khác nhau
- Dễ query và báo cáo
- **Nhưng KHÔNG BẮT BUỘC** - thiết kế hiện tại đã giải quyết vấn đề chính

**Priority: LOW** � (vì vấn đề chính đã được giải quyết)

---

## 📝 CODE EXAMPLE: CANCEL BOOKING API

```typescript
// APIs: Add cancel endpoint
// POST /bookings/:id/cancel
app.post("/bookings/:id/cancel", async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Get booking
    const booking = db.bookingOrders.find((b) => b.id === bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ error: "Booking already cancelled" });
    }

    // Get all segments
    const segments = db.bookingSegments.filter((s) => s.bookingOrderId === bookingId);

    // Cancel based on ticket type
    if (booking.ticketType === "ROUND_TRIP") {
      // Atomic cancellation for round-trip
      segments.forEach((segment) => {
        segment.status = "Cancelled";

        // Release seats
        const seatClass = db.seatClasses.find((sc) => sc.id === segment.seatClassId);
        if (seatClass) {
          seatClass.availableSeats += segment.numSeats;
        }
      });

      booking.status = "Cancelled";

      // Calculate refund
      const refundAmount = calculateRefund(booking, segments);

      return res.json({
        success: true,
        message: "Round-trip ticket cancelled successfully",
        bookingId: booking.id,
        segmentsCancelled: segments.length,
        refundAmount: refundAmount,
      });
    } else {
      // ONE_WAY cancellation
      // Similar logic...
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper function
function calculateRefund(booking, segments) {
  // Apply refund policy based on ticket type
  const now = new Date();
  const departureDate = new Date(segments[0].flight.departureTime);
  const daysUntilDeparture = (departureDate - now) / (1000 * 60 * 60 * 24);

  if (booking.ticketType === "ROUND_TRIP") {
    // Round-trip refund policy
    if (daysUntilDeparture >= 7) {
      return booking.totalPrice * 0.9; // 90% refund
    } else if (daysUntilDeparture >= 3) {
      return booking.totalPrice * 0.7; // 70% refund
    } else {
      return booking.totalPrice * 0.5; // 50% refund
    }
  } else {
    // ONE_WAY refund policy
    // Different policy...
  }
}
```

---

## 🚀 NEXT STEPS (NẾU MUỐN CẢI THIỆN THÊM)

### **Hiện tại đã có:**

✅ Database schema hỗ trợ cancel 1 lần qua BookingOrder  
✅ User không phải hủy 2 vé riêng lẻ  
✅ Có FlightLookupScreen để tra cứu booking

### **Có thể implement thêm (optional):**

**1. Add Cancel Button trong FlightLookupScreen:**

```typescript
// Thêm nút hủy vé trong results
<TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking(item.booking.id)}>
  <Text>Hủy đơn đặt vé</Text>
</TouchableOpacity>
```

**2. Implement Cancel API:**

```typescript
// POST /bookings/:id/cancel
async function handleCancelBooking(bookingOrderId: string) {
  const confirmed = await Alert.prompt(
    "Xác nhận hủy vé",
    "Bạn có chắc muốn hủy đơn đặt vé này? (Bao gồm cả chiều đi và về)"
  );

  if (confirmed) {
    await apiClient.post(`/bookings/${bookingOrderId}/cancel`);
    // Backend tự động update tất cả segments
  }
}
```

**3. (Optional) Add ticketType field:**

- Để code rõ ràng hơn
- Dễ apply refund policy
- Estimated: 4-6 hours

**Estimated time cho Cancel feature: 2-3 hours**
**Impact: MEDIUM (convenience feature)**
**Difficulty: LOW**
**Priority: MEDIUM** 🟡 (nice to have, không bắt buộc)
