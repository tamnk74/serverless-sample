import { user } from '../models';
import BaseBusiness from './BaseBusiness';
 
export default class HallBusiness extends BaseBusiness {
  constructor() {
    super(user);
  }
}