import NonFungibleToken from "./utility/NonFungibleToken.cdc"
import MetadataViews from "./utility/MetadataViews.cdc"

access(all) contract Deedz: NonFungibleToken {

    // -----------------------------------------------------------------------
    // NonFungibleToken Standard Events
    // -----------------------------------------------------------------------
    access(all) event ContractInitialized()
    access(all) event Withdraw(id: UInt64, from: Address?)
    access(all) event Deposit(id: UInt64, to: Address?)

    access(all) var totalSupply: UInt64

    access(all) resource interface Public {
        access(all) let id: UInt64
    }

    access(all) resource NFT: NonFungibleToken.INFT, Public, MetadataViews.Resolver {
        access(all) let id: UInt64
        access(all) let worldID: UInt64
        access(all) let territoryID: UInt32

        init(worldID: UInt64, territoryID: UInt32) {
            self.id = self.uuid
            self.worldID = worldID
            self.territoryID = territoryID

            Deedz.totalSupply = Deedz.totalSupply + 1
        }

        access(all) fun getViews(): [Type] {
			return [
			Type<MetadataViews.Display>(),
			Type<MetadataViews.Royalties>(),
			Type<MetadataViews.Editions>(),
			Type<MetadataViews.ExternalURL>(),
			Type<MetadataViews.NFTCollectionData>(),
			Type<MetadataViews.NFTCollectionDisplay>(),
			Type<MetadataViews.Traits>()
			]
		}

        access(all) fun resolveView(_ view: Type): AnyStruct? {
			// switch view {
            //     case Type<MetadataViews.Display>():
            //         return MetadataViews.Display(
            //             name: self.nickname,
            //             description: self.beastTemplate.description,
            //             thumbnail: MetadataViews.IPFSFile(cid: self.beastTemplate.image, path: nil)
            //         )
            //     case Type<MetadataViews.Royalties>():
            //         let royalties: [MetadataViews.Royalty] = BasicBeasts.royalties
            //         if self.firstOwner != nil {
            //             royalties.append(
            //                 MetadataViews.Royalty(
            //                 recepient: getAccount(self.firstOwner!).getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver),
            //                 cut: 0.05, // 5% royalty on secondary sales
            //                 description: "First owner 5% royalty from secondary sales."
            //             ))
            //         }
            //         return MetadataViews.Royalties(
            //             royalties
            //         )
            //     case Type<MetadataViews.Editions>():
            //         // There is no max number of NFTs that can be minted from this contract
            //         // so the max edition field value is set to nil
            //         let editionInfo = MetadataViews.Edition(name: "Basic Beasts Edition".concat(" ").concat(self.beastTemplate.name).concat(" ").concat(self.beastTemplate.skin), number: UInt64(self.serialNumber), max: UInt64(BasicBeasts.getNumberMintedPerBeastTemplate(beastTemplateID: self.beastTemplate.beastTemplateID)!))
            //         let editionList: [MetadataViews.Edition] = [editionInfo]
            //         return MetadataViews.Editions(
            //             editionList
            //         )
            //     case Type<MetadataViews.ExternalURL>():
            //         //Get dexNumber in url format e.g. 010, 001, etc.
            //         let num: String = "00".concat(self.beastTemplate.dexNumber.toString())
            //         let dex: String = num.slice(from: num.length-3, upTo: num.length)

            //         //Get skin in url format e.g. normal, shiny-gold
            //         let skin: String = self.beastTemplate.skin.toLower()
            //         var skinFormatted: String = ""
            //         var i = 0 
            //         while i < skin.length {
            //             let char = skin[i]
            //                 if(char == " ") {
            //                 skinFormatted = skinFormatted.concat("-")
            //                 } else {
            //                 skinFormatted = skinFormatted.concat(char.toString())
            //                 }
            //             i = i + 1
            //         }
            //         return MetadataViews.ExternalURL("https://basicbeasts.io/".concat("beast").concat("/").concat(dex).concat("-").concat(skinFormatted)) // e.g. https://basicbeasts.io/beast/001-cursed-black/
            //     case Type<MetadataViews.NFTCollectionData>():
            //         return MetadataViews.NFTCollectionData(
            //             storagePath: BasicBeasts.CollectionStoragePath,
            //             publicPath: BasicBeasts.CollectionPublicPath,
            //             providerPath: BasicBeasts.CollectionPrivatePath,
            //             publicCollection: Type<&BasicBeasts.Collection{BasicBeasts.BeastCollectionPublic}>(),
            //             publicLinkedType: Type<&BasicBeasts.Collection{BasicBeasts.BeastCollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(),
            //             providerLinkedType: Type<&BasicBeasts.Collection{BasicBeasts.BeastCollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Provider, MetadataViews.ResolverCollection}>(),
            //             createEmptyCollectionFunction: fun(): @NonFungibleToken.Collection { return <-BasicBeasts.createEmptyCollection()}
            //         )
            //     case Type<MetadataViews.NFTCollectionDisplay>():
            //         let externalURL = MetadataViews.ExternalURL("https://basicbeasts.io")
            //         let squareImage = MetadataViews.Media(file: MetadataViews.IPFSFile(cid: "Qmd9d2EcdfKovAxQVDCgtUXh5RiqhoRRW1HYpg4zN75JND", path: nil), mediaType: "image/png")
            //         let bannerImage = MetadataViews.Media(file: MetadataViews.IPFSFile(cid: "QmQXF95pcL9j7wEQAV9NFUiV6NnHRAbD2SZjkpezr3hJgp", path: nil), mediaType: "image/png")
            //         let socialMap : {String : MetadataViews.ExternalURL} = {
            //             "twitter" : MetadataViews.ExternalURL("https://twitter.com/basicbeastsnft"),
            //             "discord" : MetadataViews.ExternalURL("https://discord.com/invite/xgFtWhwSaR")
            //         }
            //         return MetadataViews.NFTCollectionDisplay(name: "Basic Beasts", description: "Basic Beasts by BB Club DAO", externalURL: externalURL, squareImage: squareImage, bannerImage: bannerImage, socials: socialMap)
            //     case Type<MetadataViews.Traits>():
            //         let traits: [MetadataViews.Trait] = []
            //         let skin: MetadataViews.Trait = MetadataViews.Trait(name: "Skin", value: self.beastTemplate.skin, displayType: "String", rarity: nil)
            //         traits.append(skin)
            //         let dex: MetadataViews.Trait = MetadataViews.Trait(name: "Dex Number", value: self.beastTemplate.dexNumber, displayType: "Number", rarity: nil)
            //         traits.append(dex)
            //         let starLevel: MetadataViews.Trait = MetadataViews.Trait(name: "Star Level", value: self.beastTemplate.starLevel, displayType: "Number", rarity: nil)
            //         traits.append(starLevel)
            //         let gender: MetadataViews.Trait = MetadataViews.Trait(name: "Gender", value: self.sex, displayType: "String", rarity: nil)
            //         traits.append(gender)
            //         let element: MetadataViews.Trait = MetadataViews.Trait(name: "Element", value: self.beastTemplate.elements[0], displayType: "String", rarity: nil)
            //         traits.append(element)
            //         let gen: MetadataViews.Trait = MetadataViews.Trait(name: "Generation", value: self.beastTemplate.generation, displayType: "Number", rarity: nil)
            //         traits.append(gen)
            //         return MetadataViews.Traits(traits)
            // }
			return nil
        }
        
    }

    access(all) resource interface DeedzCollectionPublic {
        access(all) fun deposit(token: @NonFungibleToken.NFT)
        access(all) fun getIDs(): [UInt64]
        access(all) fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        access(all) fun borrowDeedz(id: UInt64): &Deedz.NFT{Public}? { 
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow Deedz reference: The ID of the returned reference is incorrect"
            }
        }

    }

    access(all) resource Collection: DeedzCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {

        access(all) var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        access(all) fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) 
                ?? panic("Cannot withdraw: The Beast does not exist in the Collection")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <-token
        }

        access(all) fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @Deedz.NFT
            let id = token.id
            let oldToken <- self.ownedNFTs[id] <- token
            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }
            destroy oldToken
        }

        access(all) fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        access(all) fun borrowDeedz(id: UInt64): &Deedz.NFT{Public}? {
            let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT?
            return (ref as! &Deedz.NFT{Public}?)!
        }

        access(all) fun borrowEntireDeedz(id: UInt64): &Deedz.NFT? {
            let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT?
            return (ref as! &Deedz.NFT?)!
        }

        access(all) fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
			let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
			let deedzNFT = nft as! &Deedz.NFT
			return deedzNFT 
		}

        destroy() {
            destroy self.ownedNFTs
        }
    }

    access(all) fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Deedz.Collection()
    }

    access(account) fun mintDeedz(worldID: UInt64, territoryID: UInt32): @Deedz.NFT {
        return <- create NFT(worldID: worldID, territoryID: territoryID)
    }

    init() {
        self.totalSupply = 0

    }

}