'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Percent } from 'lucide-react';

interface FinancingCalculatorProps {
  darkMode?: boolean;
}

export default function FinancingCalculator({ darkMode = false }: FinancingCalculatorProps) {
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

  if (darkMode) {
    return (
      <div className="w-full max-w-full">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-xl">
          <DollarSign className="w-6 h-6 text-primary" />
          Financing Calculator
        </h3>

        <div className="space-y-5">
          {/* Car Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Car Price
            </label>
            <input
              type="number"
              value={carPrice}
              onChange={(e) => setCarPrice(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary focus:outline-none"
              placeholder="25000"
            />
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Down Payment
            </label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary focus:outline-none"
              placeholder="5000"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary focus:outline-none"
              placeholder="6.5"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Loan Term (months)
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:border-primary focus:outline-none"
            >
              <option value="36" className="bg-black text-white">36 months (3 years)</option>
              <option value="48" className="bg-black text-white">48 months (4 years)</option>
              <option value="60" className="bg-black text-white">60 months (5 years)</option>
              <option value="72" className="bg-black text-white">72 months (6 years)</option>
              <option value="84" className="bg-black text-white">84 months (7 years)</option>
            </select>
          </div>

          {/* Results */}
          <div className="bg-primary/10 rounded-xl p-5 border border-primary/20 space-y-3 mt-6">
            <div className="flex justify-between items-center gap-2">
              <span className="text-sm text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Monthly Payment
              </span>
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(results.monthly)}
              </span>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Total Amount
                </span>
                <span className="text-base font-semibold text-white">
                  {formatCurrency(results.total)}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Total Interest
                </span>
                <span className="text-base font-semibold text-white">
                  {formatCurrency(results.totalInterest)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mt-4">
            <p className="text-sm text-gray-300 text-center">
              <strong className="text-primary">Tip:</strong> A larger down payment reduces your monthly payment and total interest paid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-blue-200 w-full max-w-full">
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-primary" />
        Financing Calculator
      </h3>

      <div className="space-y-3">
        {/* Car Price */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Car Price
          </label>
          <input
            type="number"
            value={carPrice}
            onChange={(e) => setCarPrice(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none"
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
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none"
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
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none"
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
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="36">36 months (3 years)</option>
            <option value="48">48 months (4 years)</option>
            <option value="60">60 months (5 years)</option>
            <option value="72">72 months (6 years)</option>
            <option value="84">84 months (7 years)</option>
          </select>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2 mt-3">
          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-600 flex items-center gap-1 shrink-0">
              <Calendar className="w-4 h-4" />
              Monthly Payment
            </span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(results.monthly)}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-2 space-y-1">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Total Amount
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(results.total)}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
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
