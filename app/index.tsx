import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const API_KEY = 'ea12162e2cd555298f6e7a1f';
const API_URL = 'https://v6.exchangerate-api.com/v6/';

interface ExchangeRates {
  [key: string]: number;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [conversionRate, setConversionRate] = useState<number>(1);

  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'NZD'
  ];

  useEffect(() => {
    // loadLastUsedValues();
    fetchExchangeRates(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  // const loadLastUsedValues = async () => {
  //   try {
  //     const savedAmount = await AsyncStorage.getItem('lastAmount');
  //     const savedFromCurrency = await AsyncStorage.getItem('lastFromCurrency');
  //     const savedToCurrency = await AsyncStorage.getItem('lastToCurrency');

  //     if (savedAmount) setAmount(savedAmount);
  //     if (savedFromCurrency) setFromCurrency(savedFromCurrency);
  //     if (savedToCurrency) setToCurrency(savedToCurrency);
  //   } catch (error) {
  //     console.error('Error loading saved values:', error);
  //   }
  // };

  // const saveLastUsedValues = async () => {
  //   try {
  //     await AsyncStorage.setItem('lastAmount', amount);
  //     await AsyncStorage.setItem('lastFromCurrency', fromCurrency);
  //     await AsyncStorage.setItem('lastToCurrency', toCurrency);
  //   } catch (error) {
  //     console.error('Error saving values:', error);
  //   }
  // };

  const fetchExchangeRates = async (from: string, to: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}${API_KEY}/latest/${fromCurrency}`);
      const data = await response.json();

      // console.log('Full API Response:', JSON.stringify(data, null, 2));

      if (data.result === 'success') {
        const rate = data.conversion_rates[to];
        // console.log(`Conversion Rate (${fromCurrency} to ${toCurrency}):`, rate);
        if (!rate){
          Alert.alert('Error', `Unable to find conversion rate from ${fromCurrency} to ${toCurrency}`);
          return;
        }

        setConversionRate(rate);
        const convertedValue = (Number(amount) * rate).toFixed(2);
        setConvertedAmount(convertedValue);
      } else {
        Alert.alert('Error', 'Unable to fetch exchange rates');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    
    setFromCurrency(newFrom);
    setToCurrency(newTo);
  };

  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value);
  };

  const handleToCurrencyChange = (value: string) => {
    setToCurrency(value);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  return (
    <View style={styles.container}>
      {/* <ImageBackground
       source={require('../assets/images/background-image.png')}
       style={styles.backgroundImage}
     > */}
      <View style={styles.card}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={handleAmountChange}
          placeholder="Enter amount"
        />

        <Text style={styles.label}>From</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={fromCurrency}
            onValueChange={(itemValue) => setFromCurrency(itemValue)}
          >
            {currencies.map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
          <MaterialIcons name="swap-vert" size={24} color="#43046D" />
        </TouchableOpacity>

        <Text style={styles.label}>To</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={toCurrency}
            onValueChange={(itemValue) => setToCurrency(itemValue)}
            dropdownIconColor="#43046D"
          >
            {currencies.map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          style={styles.convertButton}
          onPress={() => fetchExchangeRates(fromCurrency, toCurrency)}
        >
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#43046D" />
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Converted Amount:</Text>
            <Text style={styles.resultValue}>
              {toCurrency} {convertedAmount}
            </Text>
            <Text style={styles.resultLabel}>Conversion Rate:
              1 {fromCurrency} = {conversionRate.toFixed(2)} {toCurrency}
            </Text> 
          </View>
        )}
      </View>
      {/* </ImageBackground> */}
    </View>
  );
}

const styles = StyleSheet.create({
  // backgroundImage: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    // width: 350,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#43046D',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.9,
    elevation: 7,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  swapButton: {
    alignSelf: 'center',
    padding: 10,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#43046D',
    marginTop: 5,
  },
  convertButton: {
    backgroundColor: '#43046D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  convertButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});