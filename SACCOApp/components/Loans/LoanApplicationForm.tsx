import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const LoanApplicationForm = () => {
  return (
    <View>
      <Text>Apply for a Loan</Text>
      <TextInput placeholder="Loan Amount" />
      <TextInput placeholder="Interest Rate" />
      <Button title="Submit" onPress={() => {}} />
    </View>
  );
};

export default LoanApplicationForm;
