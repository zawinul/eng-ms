import { MiomoduloModule } from './miomodulo.module';

describe('MiomoduloModule', () => {
  let miomoduloModule: MiomoduloModule;

  beforeEach(() => {
    miomoduloModule = new MiomoduloModule();
  });

  it('should create an instance', () => {
    expect(miomoduloModule).toBeTruthy();
  });
});
