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
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-8 sm:p-12 overflow-hidden relative" dir="ltr">
      {/* Red accent top border similar to the logo in the image */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
      
      {/* Title removed as it's already in the page header */}

      <div className="space-y-10">
        {/* Property Price */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-semibold text-lg">Precio de la propiedad</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₪</span>
              <input 
                type="number" 
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-44 text-right text-xl font-bold text-gray-900 border border-gray-200 bg-white py-2.5 pr-4 pl-8 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none transition-all duration-300 hover:border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Down Payment Slider */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <label className="text-gray-700 font-semibold text-lg">Enganche / Pago Inicial</label>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="relative group">
                <input 
                  type="number" 
                  step="0.1"
                  value={propertyPrice > 0 ? Number(((downPayment / propertyPrice) * 100).toFixed(1)) : 0}
                  onChange={(e) => {
                    const newPercentage = Math.min(100, Math.max(0, Number(e.target.value)));
                    setDownPayment((newPercentage / 100) * propertyPrice);
                  }}
                  className="w-24 text-right text-lg font-bold text-gray-900 border border-gray-200 bg-white py-1.5 pr-7 pl-2 rounded-lg focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none transition-all duration-300 hover:border-gray-300 shadow-sm group-hover:shadow"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm pointer-events-none">%</span>
              </div>
              <span className="text-2xl font-extrabold text-gray-900 min-w-[140px] text-right tracking-tight">{formatCurrency(downPayment)}</span>
            </div>
          </div>
          <div className="relative pt-2 pb-4">
            <input 
              type="range" 
              min="0" 
              max={propertyPrice} 
              step="10000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider"
              style={{
                background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(propertyPrice > 0 ? (downPayment / propertyPrice) * 100 : 0)}%, #e5e7eb ${(propertyPrice > 0 ? (downPayment / propertyPrice) * 100 : 0)}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>₪0</span>
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
              className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider"
              style={{
                background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((years - 5) / 25) * 100}%, #e5e7eb ${((years - 5) / 25) * 100}%, #e5e7eb 100%)`
              }}
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
                className="w-32 text-right text-xl font-bold text-gray-900 border border-gray-200 bg-white py-2.5 pr-8 pl-4 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none transition-all duration-300 hover:border-gray-300 shadow-sm"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold pointer-events-none">%</span>
            </div>
          </div>
        </div>

        {/* Results Box */}
        <div className="bg-gradient-to-br from-red-50 via-white to-gray-50 rounded-3xl p-8 md:p-10 mt-12 border border-red-100 shadow-[0_8px_30px_rgba(220,38,38,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-red-100/60 text-center relative z-10">
            
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

          <div className="mt-12 flex justify-center relative z-10">
            <button className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 px-14 rounded-full shadow-[0_10px_25px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_35px_rgba(220,38,38,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] text-lg w-full md:w-auto flex items-center justify-center gap-2 group">
              <span>Solicitar Propuesta</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
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
        input[type=range].range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          border: 5px solid #dc2626;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(220,38,38,0.2);
          transition: transform 0.1s;
        }
        input[type=range].range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        input[type=range].range-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          border: 5px solid #dc2626;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(220,38,38,0.2);
          transition: transform 0.1s;
        }
        input[type=range].range-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
      `}} />
    </div>
  );
}
