"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Home, Percent, FileText, CheckCircle2 } from 'lucide-react';

export function MortgageCalculator({ 
  propertyPrice = 250000, 
  propertySize = 100 
}: { 
  propertyPrice?: number, 
  propertySize?: number 
}) {
  const [price, setPrice] = useState(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [years, setYears] = useState(20);
  const [interestRate, setInterestRate] = useState(7.5);
  
  // Constantes inmobiliarias (ejemplo)
  const NOTARY_FEE_PERCENT = 0.05; // 5% de gastos notariales
  const MAINTENANCE_PER_SQM = 2.5; // $2.5 por m2 al mes

  const downPayment = (price * downPaymentPercent) / 100;
  const loanAmount = price - downPayment;
  const notaryFees = price * NOTARY_FEE_PERCENT;
  const monthlyMaintenance = propertySize * MAINTENANCE_PER_SQM;

  // Fórmula de hipoteca: M = P [ i(1 + i)^n ] / [ (1 + i)^n - 1]
  const calculateMonthlyPayment = () => {
    if (interestRate === 0) return loanAmount / (years * 12);
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = years * 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return payment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalUpfront = downPayment + notaryFees;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto my-8">
      <div className="bg-indigo-600 p-6 text-white flex items-center gap-3">
        <Calculator className="w-8 h-8 text-indigo-200" />
        <div>
          <h2 className="text-2xl font-bold">Cotizador Interactivo</h2>
          <p className="text-indigo-100 text-sm">Calcula tu hipoteca y gastos iniciales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Formulario */}
        <div className="p-6 md:p-8 space-y-6">
          
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Home className="w-4 h-4 text-gray-400" /> Valor de la Propiedad (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <DollarSign className="w-4 h-4 text-gray-400" /> Enganche / Down Payment
              </label>
              <span className="text-sm font-bold text-indigo-600">{downPaymentPercent}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="80" 
              step="1"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="text-right mt-1 text-sm text-gray-500">
              ${downPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Plazo (Años)
              </label>
              <select 
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value={5}>5 años</option>
                <option value={10}>10 años</option>
                <option value={15}>15 años</option>
                <option value={20}>20 años</option>
                <option value={30}>30 años</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Percent className="w-4 h-4 text-gray-400" /> Tasa Anual
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Resumen */}
        <div className="bg-gray-50 p-6 md:p-8 border-l border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Desglose Financiero</h3>
          
          <div className="space-y-6">
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Pago Mensual Estimado (Hipoteca)</p>
              <div className="text-4xl font-black text-gray-900">
                ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                <span className="text-lg font-medium text-gray-500">/mes</span>
              </div>
              <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Basado en un préstamo de ${loanAmount.toLocaleString()}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" /> Gastos Notariales (5%)
                </span>
                <span className="font-semibold text-gray-900">${notaryFees.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Enganche Requerido</span>
                <span className="font-semibold text-gray-900">${downPayment.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 mt-6 border border-indigo-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-indigo-900">Total a Pagar Hoy:</span>
                <span className="text-xl font-black text-indigo-700">${totalUpfront.toLocaleString()}</span>
              </div>
              <p className="text-xs text-indigo-600 opacity-80">
                Incluye enganche y gastos notariales estimados.
              </p>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 pt-4">
              <span>* Mantenimiento Est: ${monthlyMaintenance}/mes</span>
              <span>Propiedad: {propertySize}m²</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
