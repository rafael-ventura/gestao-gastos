import { Injectable, ComponentRef, ViewContainerRef, Type } from '@angular/core';
import { Subject } from 'rxjs';

export interface CustomModalConfig {
  width?: string;
  maxWidth?: string;
  data?: any;
  disableClose?: boolean;
}

export interface CustomModalRef<T = any> {
  close: (result?: T) => void;
  afterClosed: () => Subject<T>;
}

@Injectable({
  providedIn: 'root'
})
export class CustomModalService {
  private modalsContainer?: ViewContainerRef;
  private activeModals: ComponentRef<any>[] = [];

  setContainer(container: ViewContainerRef) {
    this.modalsContainer = container;
  }

  open<T extends object, D = any, R = any>(
    component: Type<T>, 
    config?: CustomModalConfig
  ): CustomModalRef<R> {
    if (!this.modalsContainer) {
      throw new Error('Modal container not set. Call setContainer() first.');
    }

    // Criar backdrop
    const backdropElement = document.createElement('div');
    backdropElement.className = 'custom-modal-backdrop';
    document.body.appendChild(backdropElement);

    // Criar modal container
    const modalElement = document.createElement('div');
    modalElement.className = 'custom-modal-container';
    if (config?.width) {
      modalElement.style.width = config.width;
    }
    if (config?.maxWidth) {
      modalElement.style.maxWidth = config.maxWidth;
    }
    document.body.appendChild(modalElement);

    // Criar component
    const componentRef = this.modalsContainer.createComponent(component);
    
    // Passar dados se existirem
    if (config?.data && 'data' in componentRef.instance) {
      (componentRef.instance as any).data = config.data;
    }

    // Inserir component no modal
    modalElement.appendChild(componentRef.location.nativeElement);

    // Criar modal ref
    const afterClosedSubject = new Subject<R>();
    const modalRef: CustomModalRef<R> = {
      close: (result?: R) => {
        // Remover elementos
        document.body.removeChild(backdropElement);
        document.body.removeChild(modalElement);
        
        // Destruir component
        componentRef.destroy();
        
        // Remover da lista de modais ativos
        const index = this.activeModals.indexOf(componentRef);
        if (index > -1) {
          this.activeModals.splice(index, 1);
        }
        
        // Emitir resultado
        if (result !== undefined) {
          afterClosedSubject.next(result);
        }
        afterClosedSubject.complete();
      },
      afterClosed: () => afterClosedSubject
    };

    // Passar modalRef para o component se ele aceitar
    if ('modalRef' in componentRef.instance) {
      (componentRef.instance as any).modalRef = modalRef;
    }

    // Fechar ao clicar no backdrop (se permitido)
    if (!config?.disableClose) {
      backdropElement.addEventListener('click', () => modalRef.close());
    }

    this.activeModals.push(componentRef);

    return modalRef;
  }
}
