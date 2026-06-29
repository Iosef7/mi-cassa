"use client";

import React, { useState, useEffect } from 'react';

export function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<number>(4240000);
  const [downPayment, setDownPayment] = useState<number>(2150000);
  const [years, setYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(5.06);

  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  useEffect(() => {
    // Ensure down payment is not greater than property price
    if (downPayment > propertyPrice) {
      setDownPayment(propertyPrice);
    }
    
    const calculatedLoanAmount = Math.max(0, propertyPrice - downPayment);
    setLoanAmount(calculatedLoanAmount);

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;

    if (calculatedLoanAmount <= 0 || numberOfPayments <= 0) {
      setMonthlyPayment(0);
      return;
    }

    if (monthlyInterestRate === 0) {
      setMonthlyPayment(calculatedLoanAmount / numberOfPayments);
      return;
    }

    // Amortization formula: PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const factor = Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const calculatedMonthlyPayment = calculatedLoanAmount * (monthlyInterestRate * factor) / (factor - 1);
    
    setMonthlyPayment(calculatedMonthlyPayment);
  }, [propertyPrice, downPayment, years, interestRate]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-8 sm:p-12 overflow-hidden relative" dir="ltr">
      {/* Red accent top border similar to the logo in the image */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-red-600 rotate-45"></div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Simulador de Crédito</h2>
        </div>
        <p className="text-gray-500 font-medium text-sm md:text-base">Calcula tu plan de financiamiento</p>
      </div>

      <div className="space-y-10">
        {/* Property Price */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-semibold text-lg">Precio de la propiedad</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input 
                type="number" 
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-40 text-right text-xl font-bold text-gray-900 border-none bg-gray-50 py-2 pr-4 pl-8 rounded-lg focus:ring-2 focus:ring-red-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Down Payment Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-semibold text-lg">Enganche / Pago Inicial</label>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(downPayment)}</span>
          </div>
          <div className="relative pt-2 pb-4">
            <input 
              type="range" 
              min="0" 
              max={propertyPrice} 
              step="10000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>$0</span>
              <span>{formatCurrency(propertyPrice)}</span>
            </div>
          </div>
        </div>

        {/* Years Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-semibold text-lg">Plazo en años</label>
            <span className="text-xl font-bold text-gray-900">{years} años</span>
          </div>
          <div className="relative pt-2 pb-4">
            <input 
              type="range" 
              min="5" 
              max="30" 
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>5 años</span>
              <span>30 años</span>
            </div>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-semibold text-lg">Tasa de interés anual (%)</label>
            <div className="relative">
              <input 
                type="number" 
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-28 text-right text-xl font-bold text-gray-900 border-none bg-gray-50 py-2 pr-8 pl-4 rounded-lg focus:ring-2 focus:ring-red-100 outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
            </div>
          </div>
        </div>

        {/* Results Box */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mt-10 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 text-center">
            
            {/* Monthly Payment */}
            <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
              <span className="text-gray-500 font-medium mb-2">Pago Mensual Estimado</span>
              <span className="text-4xl font-extrabold text-red-600">{formatCurrency(monthlyPayment)}</span>
            </div>
            
            {/* Interest Rate (Display) */}
            <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
              <span className="text-gray-500 font-medium mb-2">Tasa Anual</span>
              <span className="text-3xl font-bold text-gray-900">{interestRate}%</span>
            </div>

            {/* Total Loan */}
            <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
              <span className="text-gray-500 font-medium mb-2">Monto del Préstamo</span>
              <span className="text-3xl font-bold text-gray-900">{formatCurrency(loanAmount)}</span>
            </div>
            
          </div>

          <div className="mt-10 flex justify-center">
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full shadow-[0_8px_16px_rgba(220,38,38,0.25)] hover:shadow-[0_12px_20px_rgba(220,38,38,0.35)] transition-all transform hover:-translate-y-1 text-lg w-full md:w-auto">
              Solicitar Propuesta
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Esta información es una simulación basada en los datos proporcionados y no representa una oferta vinculante. 
            El cálculo utiliza un sistema de amortización francés. Las tasas y condiciones reales pueden variar al momento de solicitar el crédito formal.
          </p>
        </div>
      </div>
      
      {/* Add custom CSS to make standard range input look like the design */}
      <style dangerouslySetInnerHTML={{__html: `
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 4px solid #dc2626;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        input[type=range]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 4px solid #dc2626;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
      `}} />
    </div>
  );
}
