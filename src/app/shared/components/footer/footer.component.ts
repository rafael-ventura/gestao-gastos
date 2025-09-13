import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <p class="footer-text">
          Gestão de Gastos Simples - Organize suas finanças de forma fácil
        </p>
        <div class="footer-divider"></div>
        <p class="footer-copyright">
          © {{ currentYear }} - Desenvolvido com ❤️
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      color: white;
      padding: 32px 24px;
      margin-top: 48px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      z-index: 10;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .footer-text {
      font-size: 1rem;
      font-weight: 500;
      margin: 0 0 16px 0;
      color: rgba(255, 255, 255, 0.9);
    }

    .footer-divider {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #f56565, transparent);
      margin: 0 auto 16px auto;
      border-radius: 1px;
    }

    .footer-copyright {
      font-size: 0.875rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.6);
    }

    @media (max-width: 768px) {
      .app-footer {
        padding: 24px 16px;
        margin-top: 32px;
      }

      .footer-text {
        font-size: 0.9rem;
      }

      .footer-copyright {
        font-size: 0.8rem;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
