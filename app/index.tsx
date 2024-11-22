import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
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
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState<ExchangeRates>({});

  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'NZD'
  ];

  useEffect(() => {
    loadLastUsedValues();
    fetchExchangeRates();
  }, []);

  const loadLastUsedValues = async () => {
    try {
      const savedAmount = await AsyncStorage.getItem('lastAmount');
      const savedFromCurrency = await AsyncStorage.getItem('lastFromCurrency');
      const savedToCurrency = await AsyncStorage.getItem('lastToCurrency');

      if (savedAmount) setAmount(savedAmount);
      if (savedFromCurrency) setFromCurrency(savedFromCurrency);
      if (savedToCurrency) setToCurrency(savedToCurrency);
    } catch (error) {
      console.error('Error loading saved values:', error);
    }
  };

  const saveLastUsedValues = async () => {
    try {
      await AsyncStorage.setItem('lastAmount', amount);
      await AsyncStorage.setItem('lastFromCurrency', fromCurrency);
      await AsyncStorage.setItem('lastToCurrency', toCurrency);
    } catch (error) {
      console.error('Error saving values:', error);
    }
  };

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}${API_KEY}/latest/${fromCurrency}`);
      const data = await response.json();

      if (data.result === 'success') {
        setRates(data.conversion_rates);
        convertCurrency(amount, data.conversion_rates);
      } else {
        Alert.alert('Error', 'Unable to fetch exchange rates');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = (value: string, currentRates: ExchangeRates = rates) => {
    if (!value || isNaN(Number(value))) {
      setConvertedAmount('0');
      return;
    }

    const result = (Number(value) * currentRates[toCurrency]).toFixed(2);
    setConvertedAmount(result);
    saveLastUsedValues();
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    convertCurrency(value);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    fetchExchangeRates();
  };

  return (
    <View style={styles.container}>
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
            onValueChange={(value) => {
              setFromCurrency(value);
              fetchExchangeRates();
            }}
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
            onValueChange={(value) => {
              setToCurrency(value);
              convertCurrency(amount);
            }}
          >
            {currencies.map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#43046D" />
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Converted Amount:</Text>
            <Text style={styles.resultValue}>
              {toCurrency} {convertedAmount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
});