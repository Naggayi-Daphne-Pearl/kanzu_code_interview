import React from 'react';
import { View, Text, FlatList } from 'react-native';

interface Loan {
  id: number;
  name: string;
  amount: number;
}

const LoanList = ({ loans }: { loans: Loan[] }) => {
  return (
    <FlatList
      data={loans}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.amount}</Text>
        </View>
      )}
    />
  );
};

export default LoanList;
