import {ec as EC} from 'elliptic';
var sha256 = require("sha256");

export abstract class Signer {
    abstract sign(message: string): string;

    abstract getPublicKey(): string;
}



export class LocalSigner implements Signer {
    private readonly privKey: string;

    constructor(privKey: string) {
        this.privKey = privKey;
    }

    /**
     * sign message
     * @param message
     */
    public sign = (message: string) => {
        let privateKey = Buffer.from(this.privKey, 'hex');
        const secp256k1 = new EC('secp256k1');
        console.log('sha256加密前', message)
        const Msg = sha256.x2(message);
        console.log('sha256x2加密后', Msg)
        let sig = secp256k1.sign(Buffer.from(Msg, 'hex'), privateKey);
        console.log(sig, "sig")
        return sig.toDER("hex")
    };

    public sign1 = (message: string) => {
        const privateKey = Buffer.from(this.privKey, 'hex');
        const secp256k1 = new EC('secp256k1');
        const messageBytes = Buffer.from(message, 'utf-8');
        const Msg = sha256.x2(messageBytes);
        let sig = secp256k1.sign(Buffer.from(Msg, 'hex'), privateKey);
        return sig.toDER("hex");
    };

    public verifySignature = (content: string, sig: string, pub: string): boolean => {
        const secp256k1 = new EC('secp256k1');

        // 将签名解析为r和s值
        const signature = secp256k1.signatureFromDER(Buffer.from(sig, 'hex'));

        // 将消息哈希和公钥转换为Buffer
        const messageHash = sha256.x2(content);
        const publicKey = Buffer.from(pub, 'hex');

        // 使用公钥验证签名
        return secp256k1.verify(Buffer.from(messageHash, 'hex'), signature, publicKey);
    };

    /***
     * verify signature
     * @param content
     * @param sig
     * @param pub
     */
    public static verifyEccSignature = (content: string, sig: string, pub: string): boolean => {
        const secp256k1 = new EC('secp256k1');
        return secp256k1.verify(
            Buffer.from(sha256.x2(content), 'hex'),
            Buffer.from(sig, "hex"),
            Buffer.from(pub, 'hex'));
    };

    /***
     * generate new secp256k1 key pair
     */
    public static newKeyPair = () => {
        const ec = new EC('secp256k1');
        let key = ec.genKeyPair();

        return {
            privKey: key.getPrivate('hex'),
            pubKey: key.getPublic(true, 'hex'),
        }
    };

    public getPublicKey = () => {
        const secp256k1 = new EC('secp256k1');
        let privateKey = Buffer.from(this.privKey, 'hex');
        let keyPair = secp256k1.keyFromPrivate(privateKey);
        return keyPair.getPublic().encodeCompressed('hex')
    }
}




const signer = new LocalSigner("515eadf3e4b56219c8eed116ea3a3ec9f8645c7504c4edb1bc67bc2000f4425c");
// const message0 = "POST|/api/payOut/unifiedOrder|1694074594933|accountTax=112233445566778&amount=10&bankName=PIX_EMAIL&currency=BRA&customerAccountNumber=cvsggsasasjahsjjashc783137913139@gmail.com&customerContact=41988789227&customerEmail=tar0987321@gmail.com&customerName=OODS12&mchNo=M1693644864&mchOrderNo=SA169338446718010310001703608150&notifyUrl=http://b.aabbcc22.xyz:8010/org/org_notify/65&wayCode=PIX";
// const message1 = "POST|/api/payOut/unifiedOrder|1694074594933|accountTax=112233445566778&amount=10&bankName=PIX_EMAIL&currency=BRA&customerAccountNumber=cvsggsasasjahsjjashc783137913139@gmail.com&customerContact=41988789227&customerEmail=tar0987321@gmail.com&customerName=SÉRNHG OODS12&mchNo=M1693644864&mchOrderNo=SA169338446718010310001703608150&notifyUrl=http://b.aabbcc22.xyz:8010/org/org_notify/65&wayCode=PIX";
// const signedMessage = signer.sign(message0);
const  customerName = 'customerName=SÉRNHG OODS12'
const signedMessage = signer.sign1(customerName);
// const isValid = signer.verifySignature(customerName, signedMessage, '0353bff99033789d833fe369748e27831b142568b3d879263276290b961c93957c');

// if (isValid) {
//     console.log("Signature is valid.");
// } else {
//     console.log("Signature is invalid.");
// }


console.log("Signed message:", signedMessage);