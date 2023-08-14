transaction(publicKeyHex: String, numOfKeys: Int) {
    prepare(signer: AuthAccount) {
        let publicKey = publicKeyHex.decodeHex()

        let key = PublicKey(
            publicKey: publicKey,
            signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
        )

        var i = 0
        while i < numOfKeys {
            signer.keys.add(
                publicKey: key,
                hashAlgorithm: HashAlgorithm.SHA3_256,
                weight: 1000.0
            )
            i = i + 1
        }
    }
}