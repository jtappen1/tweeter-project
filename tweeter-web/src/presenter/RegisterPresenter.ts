import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";

export interface RegisterView{
    displayErrorMessage: (message:string) =>void;
    navigate: (originalUrl:string) => void;
    updateUserInfo: (user: User, authToken: AuthToken) => void;
    setImageBytes: (Uint8Array: Uint8Array) =>void;
    setImageUrl: (url: string) => void ;

    
}

export class RegisterPresenter{
    private service: UserService;
    private view : RegisterView;
    
    public constructor(view: RegisterView){
        this.view = view;
        this.service = new UserService();
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
        try {
            let [user, authToken] = await this.service.register(
              firstName,
              lastName,
              alias,
              password,
              imageBytes
            );
            this.view.updateUserInfo(user, authToken);
            this.view.navigate("/");
          } catch (error) {
            this.view.displayErrorMessage(
              `Failed to register user because of exception: ${error}`
            );
          }
    }


}