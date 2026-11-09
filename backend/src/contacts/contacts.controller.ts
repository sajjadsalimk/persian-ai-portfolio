import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateContactDto } from "./dto/create-contact.dto";
import { ContactsService } from "./contacts.service";

@Controller("contacts")
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.accept(createContactDto);
  }
}
