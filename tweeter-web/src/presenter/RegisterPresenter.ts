import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { ErrorView } from "./Presenter";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView{
    
    setImageBytes: (Uint8Array: Uint8Array) =>void;
    setImageUrl: (url: string) => void ;

    
}

export class RegisterPresenter extends AuthenticationPresenter{
  
    protected getItemDescription(): String {
      return "register user";
    }
    private service: UserService;
    
    
    public constructor(view: RegisterView){
      super(view)
        
        this.service = new UserService();
    }
    protected get view():RegisterView{
      return super.view as RegisterView;
  }


    public async handleImageFile(file: File | undefined){
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));
      
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
              const imageStringBase64 = event.target?.result as string;
      
              // Remove unnecessary file metadata from the start of the string.
              const imageStringBase64BufferContents =
                imageStringBase64.split("base64,")[1];
      
              const bytes: Uint8Array = Buffer.from(
                imageStringBase64BufferContents,
                "base64"
              );
      
              this.view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);
          } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
          }
    }
    public async doRegister(firstName: string, lastName: string, alias:string, password:string, imageBytes:Uint8Array){
      this.authenicate(()=>this.service.register(
              firstName,
              lastName,
              alias,
              password,
              imageBytes
            ), () => {
                this.view.navigate("/")});
        
    }


}