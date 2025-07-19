import { JobProcessor } from './job.processor';
import { Model } from 'mongoose';

describe('JobProcessor', () => {
  let jobProcessor: JobProcessor;
  let mockJobModel: Partial<Model<any>>;
  let mockLogModel: Partial<Model<any>>;

  beforeEach(() => {
    mockJobModel = {}; 
    mockLogModel = {};
    jobProcessor = new JobProcessor(
      mockJobModel as Model<any>,
      mockLogModel as Model<any>,
    );
  });

  it('should be defined', () => {
    expect(jobProcessor).toBeDefined();
  });
});
