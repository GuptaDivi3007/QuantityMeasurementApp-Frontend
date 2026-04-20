import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface HistoryItem {
  id?: number;
  type: 'length' | 'weight' | 'volume' | 'temperature';
  operation: 'convert' | 'compare' | 'add' | 'subtract' | 'multiply' | 'divide';
  firstValue: number;
  firstUnit: string;
  secondValue: number;
  secondUnit: string;
  resultText: string;
  createdAt?: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent implements OnInit {

  allHistory: HistoryItem[] = [];
  filteredHistory: HistoryItem[] = [];

  typeFilter: string = 'all';
  operationFilter: string = 'all';

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  // ✅ MAIN FIXED METHOD
  loadHistory(): void {
    this.api.getHistory().subscribe({
      next: (data: HistoryItem[]) => {
        if (data && data.length > 0) {
          this.allHistory = data;

          // ✅ also store in localStorage for backup
          localStorage.setItem('quantity-history', JSON.stringify(data));
        } else {
          // fallback if backend empty
          this.loadFromLocalStorage();
          return;
        }

        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Backend failed, loading from localStorage', err);
        this.loadFromLocalStorage();
      }
    });
  }

  // ✅ LOCAL STORAGE FIX
  loadFromLocalStorage(): void {
    const storedHistory = localStorage.getItem('quantity-history');
    this.allHistory = storedHistory ? JSON.parse(storedHistory) : [];
    this.applyFilters();
  }

  // ✅ FILTER LOGIC
  applyFilters(): void {
    this.filteredHistory = this.allHistory.filter((item) => {
      const typeMatch =
        this.typeFilter === 'all' || item.type === this.typeFilter;

      const operationMatch =
        this.operationFilter === 'all' || item.operation === this.operationFilter;

      return typeMatch && operationMatch;
    });
  }

  // ✅ CLEAR HISTORY
  clearHistory(): void {
    localStorage.removeItem('quantity-history');
    this.allHistory = [];
    this.filteredHistory = [];
  }

  // ✅ FIXED: BACK SHOULD GO TO HOME
  goBack(): void {
    this.router.navigate(['/home']);   // 🔥 IMPORTANT FIX
  }

  // ✅ LOGOUT
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}