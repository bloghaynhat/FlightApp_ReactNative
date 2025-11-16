# HỆ THỐNG ĐẶT VÉ MÁY BAY - FLIGHT BOOKING APPLICATION

## MÔ TÃ TỔNG QUAN

Flight Booking Application là ứng dụng di động được phát triển trên nền tảng React Native, cho phép người dùng tìm kiếm, đặt vé máy bay và quản lý thông tin đặt chỗ một cách dễ dàng và tiện lợi.

---

## CÁC MODULE CHỨC NĂNG CHÍNH

### **1. MODULE TRANG CHỦ (HOME MODULE)**

**Mục đích:** Hiển thị giao diện chính và cung cấp thông tin khuyến mãi, điểm đến phổ biến cho người dùng.

**Các chức năng:**

- **Hiển thị danh sách khuyến mãi:** Carousel banner trình bày các chương trình khuyến mãi, ưu đãi đặc biệt từ các hãng hàng không.
- **Danh sách điểm đến phổ biến:** Hiển thị các thành phố, điểm đến được yêu thích nhất với giá vé tham khảo.
- **Chi tiết điểm đến:** Xem thông tin chi tiết về từng điểm đến và giá vé khởi điểm.
- **Chuyển hướng đặt vé:** Người dùng có thể chọn điểm đến và chuyển sang màn hình tìm kiếm chuyến bay.

**Màn hình:**

- HomeScreen

**Components:**

- HomeHeader: Header với logo và thông tin ứng dụng
- PromotionCarousel: Carousel hiển thị các khuyến mãi
- DestinationSection: Danh sách các điểm đến
- DestinationCard: Card hiển thị thông tin từng điểm đến
- DestinationModal: Modal chi tiết điểm đến và nút "Mua vé"

---

### **2. MODULE TÌM KIẾM CHUYẾN BAY (FLIGHT SEARCH MODULE)**

**Mục đích:** Cho phép người dùng tìm kiếm các chuyến bay phù hợp với nhu cầu di chuyển.

**Các chức năng:**

- **Chọn loại chuyến bay:** Hỗ trợ tìm kiếm vé một chiều (One-way) hoặc khứ hồi (Round-trip).
- **Chọn điểm đi - điểm đến:** Tìm kiếm và chọn sân bay khởi hành và sân bay đến từ danh sách 8 sân bay.
- **Hoán đổi điểm đi/đến:** Nút swap nhanh để đổi chỗ điểm đi và điểm đến.
- **Chọn ngày bay:**
  - Chuyến một chiều: Chọn ngày khởi hành
  - Chuyến khứ hồi: Chọn ngày khởi hành và ngày về
- **Chọn số lượng hành khách:** Tăng/giảm số lượng hành khách (tối đa 9 người).
- **Tìm kiếm chuyến bay:** Gửi yêu cầu tìm kiếm đến server với các tiêu chí đã chọn.
- **Validation:** Kiểm tra tính hợp lệ của dữ liệu nhập (điểm đi khác điểm đến, ngày về sau ngày đi).

**Màn hình:**

- SearchFlightScreen

**Components:**

- RoundTripForm: Form tìm kiếm chuyến khứ hồi
- OneWayForm: Form tìm kiếm chuyến một chiều
- LocationInput: Dropdown tìm kiếm và chọn sân bay
- DateRangePicker: Calendar chọn ngày bay
- CitySearchDropdown: Dropdown tìm kiếm thành phố/sân bay

**API sử dụng:**

- GET /airports - Lấy danh sách sân bay
- GET /airports/:id - Lấy thông tin chi tiết sân bay

---

### **3. MODULE KẾT QUẢ TÌM KIẾM (SEARCH RESULT MODULE)**

**Mục đích:** Hiển thị danh sách các chuyến bay phù hợp với tiêu chí tìm kiếm.

**Các chức năng:**

- **Hiển thị danh sách chuyến bay:** Danh sách các chuyến bay chiều đi sắp xếp theo thời gian khởi hành.
- **Thông tin chuyến bay:** Hiển thị mã chuyến bay, hãng hàng không, giờ khởi hành, giờ đến, thời gian bay.
- **Hiển thị hạng ghế:** Các hạng ghế có sẵn (Economy, Business, First Class) với giá tương ứng.
- **Chọn chuyến bay và hạng ghế:** Người dùng chọn một chuyến bay và hạng ghế mong muốn.
- **Loading state:** Hiển thị trạng thái đang tải khi gọi API.
- **Empty state:** Thông báo khi không tìm thấy chuyến bay phù hợp.
- **Progress indicator:** Thanh tiến trình hiển thị bước hiện tại trong quy trình đặt vé (Bước 1/4).

**Màn hình:**

- SearchResultScreen

**Components:**

- FlightCard: Card hiển thị thông tin từng chuyến bay
- LoadingState: Màn hình loading
- EmptyState: Màn hình không có kết quả
- SearchHeader: Header với thanh progress

**API sử dụng:**

- GET /flights - Lấy danh sách chuyến bay
- GET /airlines - Lấy thông tin hãng hàng không
- GET /seatClasses - Lấy thông tin hạng ghế
- GET /airports/:id - Lấy thông tin sân bay

---

### **4. MODULE CHỌN CHUYẾN BAY CHIỀU VỀ (RETURN FLIGHT SELECTION MODULE)**

**Mục đích:** Cho phép người dùng chọn chuyến bay chiều về (chỉ áp dụng cho vé khứ hồi).

**Các chức năng:**

- **Hiển thị chuyến bay chiều đi đã chọn:** Banner thông báo chuyến bay chiều đi đã được chọn.
- **Danh sách chuyến bay chiều về:** Hiển thị các chuyến bay từ điểm đến về điểm đi.
- **Chọn chuyến bay và hạng ghế:** Tương tự như chọn chuyến bay chiều đi.
- **Hoán đổi tự động điểm đi/đến:** Tự động đảo ngược điểm đi và điểm đến cho chuyến về.
- **Progress indicator:** Hiển thị bước 1/4 trong quy trình đặt vé.

**Màn hình:**

- ReturnFlightSelectionScreen

**Components:**

- FlightCard: Card hiển thị chuyến bay
- LoadingState: Màn hình loading
- EmptyState: Màn hình không có kết quả

**API sử dụng:**

- GET /flights - Lấy danh sách chuyến bay chiều về
- GET /airlines - Lấy thông tin hãng hàng không
- GET /seatClasses - Lấy thông tin hạng ghế
- GET /airports/:id - Lấy thông tin sân bay

---

### **5. MODULE THÔNG TIN HÀNH KHÁCH (PASSENGER INFORMATION MODULE)**

**Mục đích:** Thu thập thông tin chi tiết của hành khách và thông tin liên lạc để hoàn tất đặt vé.

**Các chức năng:**

- **Nhập thông tin hành khách:**
  - Họ (Last Name)
  - Tên (First Name)
  - Ngày sinh (Birth Date)
- **Nhập thông tin liên lạc:**
  - Email
  - Số điện thoại
- **Hiển thị tóm tắt giá vé:** Tổng tiền tạm tính.
- **Xem chi tiết giá:** Modal hiển thị breakdown chi tiết của giá vé:
  - Giá vé cơ bản (Base Fare)
  - Phụ thu hệ thống & quản trị (220,000 VND)
  - Phí phục vụ hành khách (50,000 VND)
  - Phí soi chiếu an ninh (10,000 VND)
  - Thuế VAT 10%
- **Validation:**
  - Kiểm tra đầy đủ thông tin
  - Định dạng email hợp lệ
  - Số điện thoại 10-11 chữ số
  - Ngày sinh hợp lệ (DD/MM/YYYY)
  - Ngày sinh không được trong tương lai
- **Calendar picker:** Chọn ngày sinh qua giao diện lịch.
- **Progress indicator:** Hiển thị bước 2/4 trong quy trình đặt vé.

**Màn hình:**

- PassengerInfoScreen

**Components:**

- PassengerForm: Form nhập thông tin từng hành khách
- ContactForm: Form nhập thông tin liên lạc
- PriceSummary: Hiển thị tóm tắt giá vé
- DatePickerModal: Modal chọn ngày sinh
- PriceDetailModal: Modal chi tiết giá vé

**Tính năng đặc biệt:**

- Hỗ trợ nhiều hành khách (lặp form theo số lượng)
- Tính toán giá tự động dựa trên số hành khách và hạng ghế

---

### **6. MODULE XÁC NHẬN THANH TOÁN (PAYMENT CONFIRMATION MODULE)**

**Mục đích:** Cho phép người dùng xem lại toàn bộ thông tin đặt vé trước khi thanh toán.

**Các chức năng:**

- **Xem thông tin chuyến bay:**
  - Chuyến bay chiều đi: Mã chuyến bay, giờ khởi hành, giờ đến, thời gian bay
  - Chuyến bay chiều về (nếu có): Thông tin tương tự
  - Hạng ghế đã chọn
- **Xem chi tiết giá vé:**
  - Breakdown đầy đủ các khoản phí
  - Giá vé theo hành khách
  - Tổng tiền cuối cùng
- **Xem thông tin hành khách:**
  - Danh sách hành khách
  - Thông tin liên lạc
- **Collapsible sections:** Các section có thể mở/đóng để xem chi tiết.
- **Progress indicator:** Hiển thị bước 3/4 trong quy trình đặt vé.
- **Nút tiếp tục:** Chuyển sang màn hình chọn phương thức thanh toán.

**Màn hình:**

- PaymentInfoScreen

**Components:**

- PaymentHeader: Header với progress bar
- CollapsibleCard: Card có thể mở/đóng
- PaymentDetailRow: Dòng hiển thị chi tiết giá

**Tính năng đặc biệt:**

- Hiển thị timeline chuyến bay với icon và connector
- Format giá theo định dạng VND
- Responsive design phù hợp nhiều kích thước màn hình

---

### **7. MODULE PHƯƠNG THỨC THANH TOÁN (PAYMENT METHOD MODULE)**

**Mục đích:** Cho phép người dùng chọn phương thức thanh toán và hoàn tất giao dịch.

**Các chức năng:**

- **Chọn phương thức thanh toán:**
  - Momo E-wallet
  - VNPay Bank Card
  - Credit Card (Visa, Mastercard)
- **Hiển thị tóm tắt giá:** Tổng tiền phải thanh toán.
- **Kiểm tra tình trạng ghế:**
  - Gọi API kiểm tra số ghế còn trống
  - Tính toán: available = totalSeats - reserved
  - Validate đủ ghế cho số hành khách đã chọn
- **Xử lý thanh toán:**
  - Simulate payment processing (1.2 giây)
  - Tạo mã xác nhận ngẫu nhiên
- **Tạo đơn đặt vé:** Khi thanh toán thành công:
  - Tạo BookingOrder với mã xác nhận
  - Tạo BookingSegment cho chuyến bay chiều đi
  - Tạo BookingSegment cho chuyến bay chiều về (nếu có)
  - Tạo bản ghi Passenger cho từng hành khách
  - Tạo BookingPassenger mapping (segment × passenger)
- **Xử lý lỗi:**
  - Thông báo khi không đủ ghế
  - Xử lý lỗi API
- **Progress indicator:** Hiển thị bước 4/4 trong quy trình đặt vé.
- **Loading state:** Hiển thị spinner khi đang xử lý.

**Màn hình:**

- PaymentMethodScreen

**Components:**

- PaymentHeader: Header với progress bar
- Payment method cards: Các card lựa chọn phương thức thanh toán
- Loading indicator: Spinner loading

**API sử dụng:**

- GET /seatClasses/:id - Kiểm tra thông tin hạng ghế
- GET /bookingSegments?seatClassId=... - Lấy danh sách booking đã tồn tại
- POST /bookingOrders - Tạo đơn đặt vé
- POST /bookingSegments - Tạo segment chuyến bay
- POST /passengers - Tạo thông tin hành khách
- POST /bookingPassengers - Tạo mapping hành khách-segment

**Quy trình xử lý:**

1. User chọn phương thức thanh toán
2. Hệ thống kiểm tra tình trạng ghế
3. Nếu không đủ ghế → Alert user
4. Nếu đủ ghế → Simulate payment
5. Tạo BookingOrder với confirmation code
6. Tạo BookingSegments (1 hoặc 2 segments)
7. Tạo Passengers records
8. Tạo BookingPassengers mappings
9. Navigate to Confirmation screen

---

### **8. MODULE XÁC NHẬN ĐẶT CHỖ (BOOKING CONFIRMATION MODULE)**

**Mục đích:** Hiển thị thông tin xác nhận đặt vé thành công và vé điện tử.

**Các chức năng:**

- **Thông báo thành công:** Icon checkmark và message "Booking Successful!".
- **Hiển thị thông tin đặt vé:**
  - Mã xác nhận (Confirmation Code)
  - Tổng tiền đã thanh toán
  - Ngày đặt vé
  - Email liên lạc
  - Số điện thoại liên lạc
- **Hiển thị vé điện tử (E-ticket):**
  - Thông tin chuyến bay (Flight number, From/To)
  - Tên hành khách
  - Ngày giờ khởi hành
  - Số ghế
  - Mã đặt chỗ (Booking code)
  - Hạng ghế (Seat class)
  - Mã QR Code
- **Hiển thị nhiều vé:**
  - Một vé cho mỗi hành khách trên mỗi chuyến bay
  - Vé chiều đi và vé chiều về được nhóm riêng
- **Animation:** Hiệu ứng máy bay bay qua màn hình khi nhấn "Back to Home".
- **Nút về trang chủ:** Reset navigation stack và quay về HomeScreen.

**Màn hình:**

- BookingConfirmation

**Components:**

- PaymentHeader: Header hiển thị hoàn tất (4/4)
- Ticket: Component hiển thị vé điện tử với QR code
- Success icon và animation

**API sử dụng:**

- GET /seatClasses/:id - Lấy thông tin hạng ghế
- GET /flights/:id - Lấy thông tin chuyến bay
- GET /airports/:id - Lấy thông tin sân bay

**Tính năng đặc biệt:**

- Generate QR Code cho từng vé
- Ticket design giống vé máy bay thật
- Smooth animation khi navigate
- Summary cards hiển thị thông tin tổng quan

---

### **9. MODULE TRA CỨU VÉ (FLIGHT LOOKUP MODULE)**

**Mục đích:** Cho phép người dùng tra cứu thông tin đặt vé bằng mã đặt chỗ.

**Các chức năng:**

- **Nhập mã đặt chỗ:** Input field để nhập Booking Passenger ID (ví dụ: BP01, BP02).
- **Tìm kiếm:** Button "Search Booking" để thực hiện tra cứu.
- **Validation:** Kiểm tra mã không được để trống.
- **Hiển thị kết quả:**
  - Danh sách tất cả vé của booking
  - Thông tin đầy đủ từng vé
- **Hiển thị vé điện tử:** Tương tự module Booking Confirmation.
- **Xử lý lỗi:**
  - "Please enter reservation number" - Khi chưa nhập mã
  - "Reservation number not found" - Khi không tìm thấy
  - "Lookup failed" - Khi có lỗi API
- **Empty state:** Hiển thị khi chưa có kết quả tra cứu.
- **Loading state:** Spinner khi đang tìm kiếm.

**Màn hình:**

- FlightLookupScreen

**Components:**

- Search card: Card input tìm kiếm
- Ticket list: Danh sách vé tìm được
- Loading indicator
- Empty state
- Error message

**API sử dụng:**

- GET /bookingPassengers?id=... - Tìm booking passenger
- GET /bookingSegments/:id - Lấy thông tin segment
- GET /bookingOrders/:id - Lấy thông tin đơn đặt
- GET /passengers/:id - Lấy thông tin hành khách
- GET /seatClasses/:id - Lấy thông tin hạng ghế
- GET /flights/:id - Lấy thông tin chuyến bay
- GET /airports/:id - Lấy thông tin sân bay (from & to)

**Quy trình tra cứu:**

1. User nhập Booking Passenger ID
2. Hệ thống query /bookingPassengers?id=...
3. Với mỗi booking passenger tìm được:
   - Lấy thông tin segment
   - Lấy thông tin booking order
   - Lấy thông tin passenger
   - Lấy thông tin seat class
   - Lấy thông tin flight
   - Lấy thông tin airports
4. Combine tất cả data thành ticket objects
5. Hiển thị danh sách tickets

**Tính năng đặc biệt:**

- Tra cứu nhanh chỉ bằng 1 mã
- Hiển thị toàn bộ vé trong cùng booking
- Background image đẹp mắt
- Responsive design

---

## KIẾN TRÚC HỆ THỐNG

### **Công nghệ sử dụng:**

**Frontend:**

- React Native 0.81.5
- Expo SDK ~54.0.20
- TypeScript 5.9.2
- React Navigation 7.x
- Axios 1.13.1
- React Native Vector Icons 10.3.0
- React Native QR Code SVG 6.3.20
- React Native Calendars 1.1303.0

**Backend:**

- JSON Server 1.0.0-beta.3
- Node.js
- RESTful API

**Database:**

- JSON file-based database (db.json)

### **Cấu trúc dữ liệu:**

**Collections:**

1. **airports** - Danh sách sân bay (8 records)
2. **flights** - Danh sách chuyến bay
3. **airlines** - Danh sách hãng hàng không (4 records)
4. **seatClasses** - Hạng ghế cho từng chuyến bay
5. **bookingOrders** - Đơn đặt vé của khách hàng
6. **bookingSegments** - Segments chuyến bay (chiều đi/chiều về)
7. **passengers** - Thông tin hành khách
8. **bookingPassengers** - Mapping giữa segment và passenger

### **API Endpoints:**

**GET Methods:**

- GET /airports - Lấy danh sách sân bay
- GET /airports/:id - Lấy sân bay theo ID
- GET /flights - Lấy danh sách chuyến bay
- GET /flights/:id - Lấy chuyến bay theo ID
- GET /airlines - Lấy danh sách hãng bay
- GET /seatClasses - Lấy danh sách hạng ghế
- GET /bookingOrders - Lấy danh sách đơn đặt
- GET /bookingSegments - Lấy danh sách segments
- GET /passengers - Lấy danh sách hành khách
- GET /bookingPassengers - Lấy mapping segment-passenger

**POST Methods:**

- POST /bookingOrders - Tạo đơn đặt mới
- POST /bookingSegments - Tạo segment mới
- POST /passengers - Tạo hành khách mới
- POST /bookingPassengers - Tạo mapping mới

### **Luồng dữ liệu:**

```
User Interface (React Native Screens)
         ↓
    Navigation Layer
         ↓
    Service Layer (airportService, flightService)
         ↓
    API Client (Axios)
         ↓
    JSON Server (REST API)
         ↓
    Database (db.json)
```

---

## TÍNH NĂNG NỔI BẬT

### **1. User Experience:**

- Giao diện thân thiện, dễ sử dụng
- Navigation mượt mà giữa các màn hình
- Loading states và error handling rõ ràng
- Responsive design phù hợp nhiều kích thước màn hình

### **2. Business Logic:**

- Hỗ trợ cả vé một chiều và khứ hồi
- Tính toán giá tự động bao gồm các phụ phí và thuế
- Kiểm tra tình trạng ghế trống real-time
- Generate mã xác nhận tự động

### **3. Data Management:**

- Normalized database schema
- Foreign key relationships
- Support multiple passengers per booking
- Complete booking history

### **4. Security & Validation:**

- Input validation ở mọi bước
- Email format validation
- Phone number validation
- Date validation (không cho phép ngày trong tương lai)
- Seat availability checking

### **5. Visual Features:**

- QR Code generation cho mỗi vé
- E-ticket design professional
- Smooth animations và transitions
- Icon library phong phú
- Gradient effects

---

## KẾT LUẬN

Flight Booking Application là một hệ thống đặt vé máy bay hoàn chỉnh với đầy đủ các chức năng cần thiết từ tìm kiếm, đặt vé, thanh toán đến tra cứu. Ứng dụng được xây dựng trên nền tảng công nghệ hiện đại, đảm bảo hiệu suất tốt và trải nghiệm người dùng mượt mà.

**Ưu điểm:**
✅ Giao diện thân thiện, dễ sử dụng
✅ Quy trình đặt vé rõ ràng, có progress indicator
✅ Validation đầy đủ ở mọi bước
✅ Hiển thị E-ticket với QR code chuyên nghiệp
✅ Hỗ trợ tra cứu vé nhanh chóng
✅ Codebase được tổ chức tốt, dễ maintain

**Hướng phát triển:**

- Tích hợp thanh toán thật với payment gateway
- Thêm chức năng đăng nhập/đăng ký
- Lưu lịch sử đặt vé của user
- Notification khi có khuyến mãi
- Multi-language support
- Offline mode với local storage
