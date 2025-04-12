import React from 'react';
import { View, Text, TextInput, Button, useColorScheme } from 'react-native';
import { useTailwind } from 'tailwind-rn';

const LoanApplicationForm = () => {
  const tailwind = useTailwind();
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={tailwind('flex-1 justify-center items-center p-4')}>
      <Text style={tailwind(`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`)}>
        Apply for a Loan
      </Text>
      <TextInput
        style={tailwind(`border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} rounded p-2 mb-4 w-full bg-${isDarkMode ? 'gray-800' : 'white'} text-${isDarkMode ? 'white' : 'black'}`)}
        placeholder="Loan Amount"
        placeholderTextColor={isDarkMode ? 'gray' : 'darkgray'}
      />
      <TextInput
        style={tailwind(`border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} rounded p-2 mb-4 w-full bg-${isDarkMode ? 'gray-800' : 'white'} text-${isDarkMode ? 'white' : 'black'}`)}
        placeholder="Interest Rate"
        placeholderTextColor={isDarkMode ? 'gray' : 'darkgray'}
      />
      <Button title="Submit" onPress={() => {}} />
    </View>
  );
};

export default LoanApplicationForm;
