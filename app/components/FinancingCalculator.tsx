'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Percent } from 'lucide-react';

export default function FinancingCalculator() {
  const [carPrice, setCarPrice] = useState('25000');
  const [downPayment, setDownPayment] = useState('5000');
  const [interestRate, setInterestRate] = useState('6.5');
  const [loanTerm, setLoanTerm] = useState('60');

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(carPrice) - parseFloat(downPayment);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanTerm);

    if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
      return { monthly: 0, total: 0, totalInterest: 0 };
    }

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPaid = monthlyPayment * months;
    const totalInterest = totalPaid - principal;

    return {
      monthly: monthlyPayment,
      total: totalPaid + parseFloat(downPayment),
      totalInterest: totalInterest,
    };
  };

  const results = calculateMonthlyPayment();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-200">
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-primary" />
        Financing Calculator
      </h3>

      <div className="space-y-4">
        {/* Car Price */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Car Price
          </label>
          <input
            type="number"
            value={carPrice}
            onChange={(e) => setCarPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="25000"
          />
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Down Payment
          </label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="5000"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="6.5"
          />
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Loan Term (months)
          </label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="36">36 months (3 years)</option>
            <option value="48">48 months (4 years)</option>
            <option value="60">60 months (5 years)</option>
            <option value="72">72 months (6 years)</option>
            <option value="84">84 months (7 years)</option>
          </select>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Monthly Payment
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(results.monthly)}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Total Amount
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(results.total)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Percent className="w-3 h-3" />
                Total Interest
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(results.totalInterest)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded p-3 mt-3">
          <p className="text-xs text-gray-600 text-center">
            <strong>Tip:</strong> A larger down payment reduces your monthly payment and total interest paid.
          </p>
        </div>
      </div>
    </div>
  );
}
