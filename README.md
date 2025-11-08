# ✈️ Flight Booking App

A modern, user-friendly flight booking mobile application built with React Native and Expo. This app provides a seamless experience for searching flights, booking tickets, managing passenger information, and tracking reservations.

## 📱 Features

### 🏠 Home Screen
- Beautiful carousel showcasing promotional destinations
- Quick access to popular destinations
- Direct navigation to flight search
- Clean, modern UI with intuitive navigation

### 🔍 Flight Search
- **Multiple search modes:**
  - One-way flights
  - Round-trip flights
- Advanced search filters:
  - Departure and arrival airports
  - Flexible date selection with calendar picker
  - Passenger count configuration
  - Seat class selection (Economy, Business, First Class)

### 🎫 Flight Selection
- Browse available flights with detailed information
- Real-time pricing and availability
- Flight details including:
  - Departure and arrival times
  - Flight duration
  - Aircraft type
  - Seat availability
- Select return flights for round-trip bookings

### 👤 Passenger Information
- Add multiple passengers
- Comprehensive passenger details:
  - Full name
  - Date of birth
  - Gender
  - Passport information
  - Contact details (email, phone)
- Form validation for data accuracy

### 💳 Payment & Booking
- Multiple payment methods:
  - Credit/Debit cards
  - E-wallets (Momo, ZaloPay, VNPay)
  - Bank transfers
- Secure payment processing
- Booking summary with itemized costs
- Collapsible sections for easy navigation

### ✅ Booking Confirmation
- Booking success confirmation
- Display booking details:
  - Total amount paid
  - Booking date
  - Contact information
- Digital tickets with QR codes
- Auto-generated seat assignments
- Unique reservation numbers

### 🔎 Flight Lookup
- Track bookings using reservation number
- View all ticket details
- No login required
- Quick access from home screen

## 🛠️ Technology Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation and routing
  - Bottom Tabs
  - Stack Navigation

### UI/UX
- **React Native Vector Icons** - Beautiful icon sets
- **Expo Linear Gradient** - Gradient backgrounds
- **React Native Calendars** - Date selection
- **React Native QR Code SVG** - QR code generation
- **React Native Safe Area Context** - Safe area handling

### Backend & Data
- **JSON Server** - Mock REST API
- **Axios** - HTTP client for API calls

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Step 1: Clone the Repository
```bash
git clone https://github.com/bloghaynhat/FlightApp_ReactNative.git
cd FlightApp
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Start the JSON Server (Backend)
Open a new terminal window and run:
```bash
npm run server
# or
json-server --watch server/db.json --port 3000 --host 0.0.0.0
```

The API server will start at `http://localhost:3000`

### Step 4: Start the Expo Development Server
In another terminal window:
```bash
npm start
# or
expo start
```

### Step 5: Run on Device/Emulator

#### For Android:
```bash
npm run android
# or
expo start --android
```

#### For iOS:
```bash
npm run ios
# or
expo start --ios
```

#### For Web:
```bash
npm run web
# or
expo start --web
```

## 📁 Project Structure

```
FlightApp/
├── apis/                      # API services
│   ├── apiClient.ts          # Axios configuration
│   ├── airportService.ts     # Airport data services
│   └── flightService.ts      # Flight data services
│
├── assets/                    # Images and static files
│   ├── lookup.png           # Background images
│   ├── homepage.jpg
│   └── ...
│
├── components/               # Reusable components
│   ├── Home/                # Home screen components
│   │   ├── HomeHeader.tsx
│   │   ├── PromotionCarousel.tsx
│   │   ├── DestinationSection.tsx
│   │   ├── DestinationCard.tsx
│   │   └── DestinationModal.tsx
│   │
│   ├── SearchFlight/        # Flight search components
│   │   ├── LocationInput.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── OneWayForm.tsx
│   │   ├── RoundTripForm.tsx
│   │   ├── MultiCityForm.tsx
│   │   └── CitySearchDropdown.tsx
│   │
│   ├── SearchResult/        # Search result components
│   │   ├── FlightCard.tsx
│   │   ├── SearchHeader.tsx
│   │   ├── LoadingState.tsx
│   │   └── EmptyState.tsx
│   │
│   └── Payment/             # Payment components
│       ├── PaymentHeader.tsx
│       ├── Ticket.tsx
│       └── payment-card.tsx
│
├── navigation/               # Navigation configuration
│   └── AppNavigation.tsx    # Bottom tabs & stack navigators
│
├── screens/                  # Main screens
│   ├── HomeScreen.tsx
│   ├── SearchFlightScreen.tsx
│   ├── SearchResultScreen.tsx
│   ├── ReturnFlightSelectionScreen.tsx
│   ├── PassengerInfoScreen.tsx
│   ├── PaymentMethodScreen.tsx
│   ├── PaymentInfoScreen.tsx
│   ├── BookingConfirmation.tsx
│   └── FlightLookupScreen.tsx
│
├── server/                   # Mock backend
│   └── db.json              # JSON Server database
│
├── types/                    # TypeScript type definitions
│   ├── index.ts
│   ├── types.ts
│   └── navigation.ts
│
├── App.tsx                   # Main app component
├── index.ts                  # Entry point
├── package.json              # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🔗 API Endpoints

The JSON Server provides the following endpoints:

### Airports
- `GET /airports` - Get all airports
- `GET /airports/:id` - Get airport by ID

### Flights
- `GET /flights` - Get all flights
- `GET /flights/:id` - Get flight by ID
- Search: `GET /flights?departureAirportId=X&arrivalAirportId=Y`

### Seat Classes
- `GET /seatClasses` - Get all seat classes
- `GET /seatClasses/:id` - Get seat class by ID

### Bookings
- `GET /bookingOrders` - Get all booking orders
- `POST /bookingOrders` - Create new booking
- `GET /bookingSegments` - Get booking segments
- `GET /bookingPassengers` - Get booking passengers

### Passengers
- `GET /passengers` - Get all passengers
- `POST /passengers` - Create new passenger

## 🎨 Design Highlights

### Color Scheme
- **Primary Blue**: `#0070BB` - Main brand color
- **Orange Accent**: `#f59e0b` - Highlights and CTAs
- **Light Gray**: `#f8f9fb` - Backgrounds
- **White**: `#fff` - Cards and surfaces

### Key Features
- **Consistent Design Language** - Unified styling across all screens
- **Safe Area Support** - Proper handling of notches and system UI
- **Responsive Layout** - Adapts to different screen sizes
- **Smooth Animations** - Engaging user interactions
- **Loading States** - Clear feedback during async operations
- **Error Handling** - User-friendly error messages

## 📝 User Guide

### How to Book a Flight

1. **Search for Flights**
   - Tap "Book" from the bottom navigation
   - Select trip type (One-way, Round-trip, or Multi-city)
   - Choose departure and arrival airports
   - Select travel dates
   - Add number of passengers
   - Tap "Search Flights"

2. **Select Your Flight**
   - Browse available flights
   - Review flight details (time, duration, price)
   - Tap "Select" on your preferred flight
   - For round-trips, select return flight

3. **Enter Passenger Information**
   - Add passenger details for each traveler
   - Fill in required fields (name, DOB, passport, etc.)
   - Verify contact information
   - Tap "Continue"

4. **Review and Pay**
   - Review flight summary
   - Check passenger information
   - Review pricing breakdown
   - Select payment method
   - Complete payment

5. **Get Your Tickets**
   - View booking confirmation
   - Save your reservation number
   - Access digital tickets with QR codes
   - Receive confirmation via email

### How to Look Up a Booking

1. **Access Lookup**
   - Tap "Lookup" from the bottom navigation
   - Or tap "Track Flight" on the home screen

2. **Enter Reservation Number**
   - Type your reservation number (e.g., BP01)
   - Tap "Search Booking"

3. **View Your Tickets**
   - See all flight details
   - View passenger information
   - Access QR codes for check-in

## 🔧 Configuration

### API Base URL
Update the API base URL in `apis/apiClient.ts`:
```typescript
const apiClient = axios.create({
  baseURL: 'http://YOUR_IP_ADDRESS:3000',
  timeout: 10000,
});
```

**Note:** For Android emulator, use:
- `http://10.0.2.2:3000` (Android Studio emulator)
- `http://YOUR_LOCAL_IP:3000` (Physical device)

### App Configuration
Edit `app.json` to customize:
- App name
- App icon
- Splash screen
- Orientation
- Status bar style

## 🐛 Troubleshooting

### Common Issues

**1. Cannot connect to JSON Server**
- Ensure JSON Server is running on port 3000
- Check your IP address in `apiClient.ts`
- For physical devices, use your local network IP
- Verify firewall settings

**2. Module not found errors**
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript definitions in `types/` folder

**3. Android/iOS build issues**
- Clear Expo cache: `expo start -c`
- Clear Metro cache: `npx react-native start --reset-cache`
- Rebuild: `cd android && ./gradlew clean` (Android)

**4. Calendar picker not working**
- Ensure `react-native-calendars` is properly installed
- Check date format in DateRangePicker component

## 🚀 Future Enhancements

- [ ] User authentication and profiles
- [ ] Booking history
- [ ] Push notifications
- [ ] Real payment gateway integration
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Flight status tracking
- [ ] Seat selection visual interface
- [ ] Loyalty program integration
- [ ] Travel insurance options

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Developer

**Minh Đức**
- GitHub: [@bloghaynhat](https://github.com/bloghaynhat)

**Trọng Nhân**
- GitHub: [@NhanItJAVA1](https://github.com/NhanItJAVA1)

## 🙏 Acknowledgments

- React Native community
- Expo team
- All open-source contributors

---

**Need Help?** Feel free to open an issue on GitHub!

**Happy Flying! ✈️**
