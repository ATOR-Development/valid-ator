import { Test, TestingModule } from '@nestjs/testing'
import { VerificationService } from './verification.service'
import { ConfigModule } from '@nestjs/config'

describe('VerificationService', () => {
    let service: VerificationService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
            providers: [VerificationService],
        }).compile()

        service = module.get<VerificationService>(VerificationService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should check if the fingerprint was registered', async () => {
        expect(
            await service.verifyRelay({
                fingerprint: 'AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
                ator_public_key: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                consensus_weight: 1,
            }),
        ).toBe('NotRegistered')
    })

    it('should check if the fingerprint was verified', async () => {
        expect(
            await service.verifyRelay({
                fingerprint: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                ator_public_key: '0x32c4e3A20c3fb085B4725fcF9303A450e750602A',
                consensus_weight: 1,
            }),
        ).toBe('AlreadyVerified')
    })

    // it('should allow registering relay fingerprints', async () => {
    //     expect(
    //         await service.verifyRelay({
    //             fingerprint: 'FAE2B62C2A081FB5F6959773E7DD7068C3A8C822',
    //             ator_public_key: '0x32c4e3A20c3fb085B4725fcF9303A450e750602A'
    //     }),
    //     ).toBe('OK')
    // })
})