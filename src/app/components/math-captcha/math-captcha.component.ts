import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InputFieldComponent } from '../input-field/input-field.component';

@Component({
  selector: 'app-math-captcha',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,InputFieldComponent],
  templateUrl: './math-captcha.component.html',
  styleUrls: ['./math-captcha.component.scss']
})
export class MathCaptchaComponent implements OnInit {
  operand1 = signal(this.randomNumber());
  operand2 = signal(this.randomNumber());
  operator = signal(this.randomOperator());

  expressionDisplay = computed(() => `${this.operand1()} ${this.operator()} ${this.operand2()}`);
  captchaAnswer = computed(() => this.evaluateCaptcha());
  captchaInput = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.captchaInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((userAnswer) => {
        this.validateAnswerOnChange(userAnswer);
      });
  }

  generateCaptcha() {
    this.operator.set(this.randomOperator());

    if (this.operator() === '-') {
      const [op1, op2] = [this.randomNumber(), this.randomNumber()].sort((a, b) => b - a);
      this.operand1.set(op1);
      this.operand2.set(op2);
    } else if (this.operator() === '/') {
      let op1 = this.randomNumber();
      let op2 = this.randomNumber();
      while (op2 === 0) {
        op2 = this.randomNumber();
      }
      if (op1 < op2) [op1, op2] = [op2, op1];
      this.operand1.set(op1);
      this.operand2.set(op2);
    } else {
      this.operand1.set(this.randomNumber());
      this.operand2.set(this.randomNumber());
    }

    // Reset the captcha input and clear errors
    this.captchaInput.reset();
    this.captchaInput.setErrors(null);
  }

  private randomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

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

  // Validate answer on input change without setting errors
  private validateAnswerOnChange(userAnswer: string | null | undefined) {
    if (userAnswer && userAnswer.trim() !== '') { 
      const answer = Number(userAnswer);
      if (answer === this.captchaAnswer()) {
        this.captchaInput.setErrors(null); 
      }
    }
  }

  // Validate on blur to set errors and show the error message
  validateAnswerOnBlur(userAnswer: string | null | undefined) {
    if (userAnswer && userAnswer.trim() !== '') { 
      const answer = Number(userAnswer); 
      if (answer === this.captchaAnswer()) {
        this.captchaInput.setErrors(null);
      } else {
        this.captchaInput.setErrors({ incorrect: true }); 
      }
    } else {
      this.captchaInput.setErrors(null);
    }
  }

  // Error message to display
  get captchaErrorMessage() {
    if (this.captchaInput.hasError('incorrect')) {
      return 'Incorrect answer, please try again.';
    }
    return '';
  }
}
