# CoinVert

A React Native mobile application that allows users to convert between different currencies using real-time exchange rates. The app features a clean, intuitive interface and uses the ExchangeRate-API for accurate currency conversion.

## Features

- Real-time currency conversion
- Support for 10 major currencies (USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, INR, NZD)
- Clean and intuitive user interface
- Quick currency swap functionality
- Display of current conversion rates
- Error handling for network issues and API failures
- Loading indicators for better user experience

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v12 or higher)
- Expo CLI
- npm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CoinVert
```

2. Install dependencies:
```bash
npm install
```

3. Create an account at [ExchangeRate-API](https://www.exchangerate-api.com/) and get your API key.

4. Replace the API key in `index.tsx`:
```typescript
const API_KEY = 'your_api_key_here';
```

## Running the App

To start the development server:

```bash
npx expo start
```

This will open the Expo developer tools in your browser. You can then:
- Run on Android emulator
- Scan the QR code with the Expo Go app on your physical device

## Dependencies

- React Native
- Expo
- @react-native-picker/picker
- @react-native-async-storage/async-storage
- @expo/vector-icons
- expo-router

## Project Structure

- `index.tsx` - Main currency converter component with core functionality
- `_layout.tsx` - App layout configuration with header styling
- `styles` - Styling definitions using React Native StyleSheet

## Features Implementation

### Currency Conversion
The app uses the ExchangeRate-API to fetch real-time conversion rates. The conversion happens automatically when:
- The amount is changed
- The source currency is changed
- The target currency is changed

### UI Components
- Text input for amount entry
- Currency pickers for source and target currencies
- Swap button to quickly exchange source and target currencies
- Convert button to trigger manual conversion
- Results display showing converted amount and current rate

### Error Handling
The app includes comprehensive error handling for:
- Network errors
- API failures
- Invalid conversion rates
- Input validation

## Styling

The app uses a custom color scheme with:
- Primary color: #43046D (Deep Purple)
- Background color: #f5f5f5 (Light Gray)
- Card shadows and elevation for depth
- Responsive layout that adapts to different screen sizes

## Future Enhancements

The following features are commented out in the code but can be implemented:
- Local storage for saving last used values
- Background image support
- Additional currency support
- Historical rate tracking
- Offline mode support
- Light and Dark mode settings
- Graphical representation of rate changes
- Animations for increased user interaction

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License