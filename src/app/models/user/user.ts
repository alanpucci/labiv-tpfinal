export class User {
  id: string="";
  email: string="";
  name: string="";
  lastName: string="";
  creationDate?: Date;
  age: number=0;
  dni: number=0;
  speciality?: string;
  socialWork?: string;
  password?: string;
  repeatPassword?: string;
  type: string="";
  files?: File[]
  images: string[]=[]
  imagesUrl?: string[]
  state?:string;

//   constructor(
//     email: string,
//     name: string,
//     lastName: string,
//     age: number,
//     dni: number,
//     images: string | string[],
//     type: string,
//     speciality?: string,
//     socialWork?: string,
//     password?: string,
//     repeatPassword?: string,
//   ) {
//     this.email = email;
//     this.name = name;
//     this.lastName = lastName;
//     this.age = age;
//     this.dni = dni;
//     this.images = images;
//     this.socialWork = socialWork;
//     this.speciality = speciality;
//     this.password = password;
//     this.repeatPassword = repeatPassword;
//     this.type = type;
//   }
}
