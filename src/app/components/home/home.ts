import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  selectedType = 'length';
  selectedOperation = 'convert';

  firstValue: number | null = null;
  secondValue: number | null = null;

  firstUnit = '';
  secondUnit = '';

  resultText = '';

  operationMap: any = {
    length: ['convert', 'compare', 'add', 'subtract', 'multiply', 'divide'],
    weight: ['convert', 'compare', 'add', 'subtract', 'multiply', 'divide'],
    volume: ['convert', 'compare', 'add', 'subtract', 'multiply', 'divide'],
    temperature: ['convert', 'compare']
  };

  unitMap: any = {
    length: ['METERS', 'CENTIMETERS', 'MILLIMETERS', 'KILOMETERS', 'FEET', 'INCHES', 'YARDS'],
    weight: ['KILOGRAM', 'GRAM', 'POUND'],
    volume: ['LITRE', 'MIILILITRE', 'GALLON'],
    temperature: ['CELSIUS', 'FAHRENHEIT', 'KELVIN']
  };

  constructor(private api: ApiService, private router: Router) {
    this.setDefaultUnits();
  }

  selectType(type: string) {
    this.selectedType = type;
    this.selectedOperation = this.operationMap[type][0];
    this.resetValues();
    this.setDefaultUnits();
  }

  selectOperation(operation: string) {
    this.selectedOperation = operation;
    this.resetValues();
  }

  setDefaultUnits() {
    this.firstUnit = this.unitMap[this.selectedType][0];
    this.secondUnit = this.unitMap[this.selectedType][1];
  }

  resetValues() {
    this.firstValue = null;
    this.secondValue = null;
    this.resultText = '';
  }

  getMeasurementType(): string {
    switch (this.selectedType) {
      case 'length': return 'LengthUnit';
      case 'weight': return 'WeightUnit';
      case 'volume': return 'VolumeUnit';
      case 'temperature': return 'TemperatureUnit';
      default: return 'LengthUnit';
    }
  }

  performAction() {

    if (
      this.firstValue === null ||
      this.firstUnit === '' ||
      this.secondUnit === '' ||
      (this.selectedOperation !== 'convert' && this.secondValue === null)
    ) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      thisQuantityDTO: {
        measurementType: this.getMeasurementType(),
        unit: this.firstUnit.toUpperCase(),
        value: Number(this.firstValue)
      },
      thatQuantityDTO: {
        measurementType: this.getMeasurementType(),
        unit: this.secondUnit.toUpperCase(),
        value: this.selectedOperation === 'convert'
          ? 0
          : Number(this.secondValue)
      }
    };

    console.log('FINAL PAYLOAD:', payload);

    this.api.calculate(payload, this.selectedOperation).subscribe({
      next: (res: any) => {

        console.log('API RESPONSE:', res);

        // ✅ HANDLE COMPARE
        if (res.resultString !== null) {
          this.resultText = res.resultString === 'true' ? '✔ True' : '✖ False';
        }

        // ✅ HANDLE NORMAL OPERATIONS
        else if (res.resultValue !== null && res.resultUnit !== null) {
          this.resultText = `${res.resultValue} ${res.resultUnit.toLowerCase()}`;
        }

        // fallback
        else {
          this.resultText = 'No result';
        }

        // ✅ SAVE HISTORY
        const history = JSON.parse(localStorage.getItem('quantity-history') || '[]');

        history.push({
          type: this.selectedType,
          operation: this.selectedOperation,
          firstValue: this.firstValue,
          secondValue: this.secondValue,
          firstUnit: this.firstUnit,
          secondUnit: this.secondUnit,
          resultText: this.resultText,
          createdAt: new Date().toISOString()
        });

        localStorage.setItem('quantity-history', JSON.stringify(history));
      },
      error: () => {
        this.resultText = 'Error performing calculation';
      }
    });
  }

  goToHistory() {
    this.router.navigate(['/history']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}