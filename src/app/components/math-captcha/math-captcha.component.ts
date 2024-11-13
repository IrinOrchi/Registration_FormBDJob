import { Component, signal, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-math-captcha',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './math-captcha.component.html',
  styleUrls: ['./math-captcha.component.scss']
})
export class MathCaptchaComponent {
  private formBuilder = inject(FormBuilder);

  operand1 = signal(this.randomNumber());
  operand2 = signal(this.randomNumber());
  operator = signal(this.randomOperator());

  expressionDisplay = computed(() => `${this.operand1()} ${this.operator()} ${this.operand2()}`);

  captchaAnswer = computed(() => this.evaluateCaptcha());

  captchaForm = this.formBuilder.group({
    captchaInput: ['', [Validators.required]]
  });

  constructor() {
    this.generateCaptcha();
  }

  generateCaptcha() {
    this.operator.set(this.randomOperator());

    if (this.operator() === '-') {
      const [op1, op2] = [this.randomNumber(), this.randomNumber()].sort((a, b) => b - a);
      this.operand1.set(op1);
      this.operand2.set(op2);
    } else {
      this.operand1.set(this.randomNumber());
      this.operand2.set(this.randomNumber());
    }

    this.captchaForm.reset();
    this.captchaForm.get('captchaInput')?.setErrors(null);  // Clear any existing errors
  }

  private randomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  // Helper to generate random operators
  private randomOperator(): string {
    const operators = ['+', '-', '*', '/'];
    return operators[Math.floor(Math.random() * operators.length)];
  }

  private evaluateCaptcha(): number {
    const op1 = this.operand1();
    const op2 = this.operand2();
    switch (this.operator()) {
      case '+': return op1 + op2;
      case '-': return op1 - op2;
      case '*': return op1 * op2;
      case '/': return Math.floor(op1 / op2); 
      default: return 0;
    }
  }

  onSubmit() {
    const userAnswer = Number(this.captchaForm.get('captchaInput')?.value); // Convert input to number
    if (userAnswer === this.captchaAnswer()) {
      alert('CAPTCHA validated successfully!');
      this.generateCaptcha();
    } else {
      this.captchaForm.get('captchaInput')?.setErrors({ incorrect: true });
    }
  }
}
