import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsEmail, MinLength } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Postagem } from "../../postagem/entities/postagem.entity"


@Entity({name: "tb_usuarios"})
export class Usuario {

    @PrimaryGeneratedColumn() 
    @ApiProperty() 
    public id: number

    @IsNotEmpty()
    @Column({length: 255, nullable: false}) 
    @ApiProperty() 
    public nome: string

    @IsEmail()
    @Column({length: 255, nullable: false })
    @ApiProperty({example: "email@email.com.br"}) 
    public usuario: string

    @IsNotEmpty()
    @MinLength(8)
    @Column({length: 255, nullable: false }) 
    @ApiProperty() 
    public senha: string

    @Column({length: 5000 }) 
    @ApiProperty() 
    public foto: string

    @ApiProperty() 
    @OneToMany(() => Postagem, (postagem) => postagem.usuario)
    postagem: Postagem[]

}