
export interface View{
    displayErrorMessage: (message:string) =>void;
}
export interface ErrorView extends View{
    displayErrorMessage: (message:string) =>void;
    displayInfoMessage: (message:string, num: number) =>void;
    clearLastInfoMessage: () => void;
}

export class Presenter{
    private _view: View;

     public constructor(view:View){
        this._view = view;
     }
     protected get view(): View{
        return this._view;
    }
    protected async doFailureReportingOperation (operation: () => Promise<void>, operationDescription: String){
        try {
          await operation();

        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to ${operationDescription} because of exception: ${(error as Error).message}`
          );
        }
      };

}