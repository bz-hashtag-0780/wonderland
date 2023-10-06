### Run server

```
npm run dev
```

### Read logs

```
heroku logs --tail --app wonderland-api
```

##How to Setup Questing For An NFT Project
Copy and uncomment one function and run one at a time

```
    /**
     * 1. Setup The NFT Collection on Your Quest Manager Account
     * Why: To receive the NFT & to get it's 'type'
     */
    // flowService.setup_beastz_collection();

    /**
     * 2. Make sure you have received the NFT from another account
     */

    /**
     * 3. Create a Quest that uses the 'NFT type' you want the Quest to support
     * Why: To allow NFTs to quest and receive rewards
     */
    // flowService.createQuest();

    /**
     * 4. Create a Quest Reward Minter. Be sure to give it a descriptive name.
     * Why: To create Reward Templates & mint Quest Rewards
     * Result: You can check your results like this https://testnet.flowview.app/account/0xcecb7655469cad83/storage/WonderlandQuestManager_2
     */
    // flowService.createMinter('Beastz Rewards');

    /**
     * 5. Add Reward Templates to the Quest Reward Minter
     * Why: To mint Quest Rewards with onchain metadata
     * Tip: Find your Minter ID using flowview.app or read the transaction and look for the event MinterDeposited
     */
    // flowService.addRewardTemplate('0');

    /**
     * 6. Now anyone with the NFTs can quest and receive rewards
     * if you set up a server where your quest manager account
     * checks for NFTs who are eligible and add rewards to them
     */
```
