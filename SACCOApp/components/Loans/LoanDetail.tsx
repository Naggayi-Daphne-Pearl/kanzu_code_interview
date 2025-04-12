import React from 'react';
import { View, Text } from 'react-native';

interface Loan {
  amount: number;
  interestRate: number;
  repaymentSchedule: string;
}

const LoanDetail = ({ loan }: { loan: Loan }) => {
  return (
    <View>
      <Text>Loan Amount: {loan.amount}</Text>
      <Text>Interest Rate: {loan.interestRate}</Text>
      <Text>Repayment Schedule: {loan.repaymentSchedule}</Text>
    </View>
  );
};

export default LoanDetail;
