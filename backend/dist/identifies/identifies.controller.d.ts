import { CreateIdentifyDto } from './dto/create-identify.dto';
import { UpdateIdentifyDto } from './dto/update-identify.dto';
import { Identifies } from './interfaces/identifies.interface';
export declare class IdentifiesController {
    private readonly identifiesService;
    constructor(identifiesService: Identifies);
    findAll(): Promise<import("./entities/identify.entity").Identify[]>;
    findOne(uuid: string): Promise<import("./entities/identify.entity").Identify>;
    restore(uuid: string): Promise<import("typeorm").UpdateResult>;
    create(createIdentifyDto: CreateIdentifyDto): Promise<CreateIdentifyDto>;
    update(updateIdentityDto: UpdateIdentifyDto): Promise<import("typeorm").UpdateResult>;
}
