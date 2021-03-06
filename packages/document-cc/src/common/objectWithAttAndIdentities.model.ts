import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate,
  FlatConvectorModel
} from '@worldsibu/convector-core-model';
import { Attribute, x509Identities, BaseObjWithAtt } from '.';

export abstract class BaseObjWithAttAndIdenties<T extends BaseObjWithAttAndIdenties<any>> extends BaseObjWithAtt<T> {
  // @Validate(yup.array(Attribute.schema()))
  // public attributes: Array<Attribute>;
  @Validate(yup.array(x509Identities.schema()))
  public identities: Array<x509Identities>;

  updateIdentities(fingerprint: string, sender: string) {
    var oldIdentities = this.identities && this.identities.filter(identity => identity.fingerprint != fingerprint)
    // update all identity is active: false
    if (oldIdentities && oldIdentities.length > 0) {
      for (var idx = 0; idx < oldIdentities.length; idx++) {
        oldIdentities[idx].status = false
      }
    }
    this.identities = oldIdentities ? [new x509Identities(true,fingerprint)].concat(oldIdentities) : [new x509Identities(true,fingerprint)]
    this.updateAuditField(sender)
  }

  getActiveIdentity() {
    var oldIdentities = this.identities.filter(identity => identity.status)
    return oldIdentities.length === 1 ? oldIdentities[0] : undefined
  }
}