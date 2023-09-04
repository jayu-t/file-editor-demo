import { statSync } from 'fs-extra';

export class FileValidator {
  static validateFile(path: string, rule: ValidationRule) {
    let message: FileValidatorMessage = {
      valid: false,
    };
    if (rule.maxSize && statSync(path).size > rule.maxSize) {
      message.valid = false;
      message.error = {
        shortDesc: 'Size error',
        descreption:
          'File size is big. It should be less than ' + rule.maxSize + ' bytes',
      };
      return message;
    }
    if (rule.allowExtentions && rule.allowExtentions.length > 0) {
      const extension = path.split('.').filter(Boolean).slice(1).join('.');
      if (!rule.allowExtentions.find((ext) => ext === extension)) {
        message.valid = false;
        message.error = {
          shortDesc: 'File exetension error',
          descreption:
            'File exetension not allowed. Allowed exentions are ' +
            rule.allowExtentions.toString(),
        };
        return message;
      }
    }

    message.valid = true;
    return message;
  }
}

export interface ValidationRule {
  allowExtentions?: string[];
  maxSize?: number;
}

export interface FileValidatorMessage {
  valid: boolean;
  error?: {
    shortDesc: string;
    descreption: string;
  };
}
