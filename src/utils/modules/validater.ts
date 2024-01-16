import { validateMessage } from '../constants/validate-message';
import { BadRequestException } from './custom-error';

class Validate {
  constructor(public input: any, private readonly name: string) {}

  /**
   * undefinded or empty string 을 검사
   */
  checkInput() {
    if (this.input === undefined || this.input === '') {
      this.setError(`${this.name}: ${validateMessage.invalidInput}`);
    }
    return this;
  }

  /**
   * @param min 최소값
   * @param max 최대값
   * 길이를 검사
   */
  checkLength(min: number, max: number) {
    const input = String(this.input);
    if (input.length < min || input.length > max) {
      this.setError(`${this.name}: ${validateMessage.length}`);
    }
    return this;
  }

  /**
   * @param regex 테스트 할 정규식
   */
  checkRegex(regex: RegExp) {
    if (!regex.test(this.input)) {
      this.setError(`${this.name}: ${validateMessage.regex}`);
    }
    return this;
  }

  /**
   * 1. string타입이라면 정수인지 검사한다
   */
  isNumber() {
    if (isNaN(Number(this.input))) {
      this.setError(`${this.name}: ${validateMessage.isNumber}`);
    }

    return this;
  }

  /**
   * boolean 타입인지 검사한다
   */
  isBoolean() {
    if (typeof this.input !== 'boolean') this.setError(validateMessage.isBoolean);
    return this;
  }

  setError(message: string) {
    throw new BadRequestException(message);
  }
}

export const validate = (input: any, name: string) => {
  const result = new Validate(input, name);

  return result;
};
