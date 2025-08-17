# Dreamprint

NFT polaroids that will make your next IRL crypto event unforgettable!

Live: https://www.dreamprint.app/

Collage: https://www.dreamprint.app/collage

<img width="1440" height="813" alt="Screenshot 2025-08-17 at 1 13 29 AM" src="https://github.com/user-attachments/assets/042d7041-0076-46b3-9bc6-a9d181eefa20" />

If you've been to many crypto events, you're probably tired of the same old T-shirts, hats, and stickers that sponsors give away for swag. For sponsors, the ROI is low too - the majority of swag is stored away in closets, never to be seen again in public.

Dreamprint fixes this with NFT polaroids—creating an experience that’s personalized, interactive, and most importantly, onchain.

Whether it’s a protocol, stablecoin, or wallet, any company can adapt polaroid prints for their own goals. Here’s how it benefits them:
- Price: for 500 pieces, Fujifilm Instax Mini film is 75% cheaper than T-Shirts
- Live UX feedback: watch people using your product, so you know how bad/good your onboarding is
- Onchain: brings users into your ecosystem
- Engagement: encourage users to share on X/Farcaster, which further boosts ROI

In the future, other creative mediums can be explored so companies can adapt them to their own strengths and value prop. For example, Uniswap had trading cards at Permissionless, Farcaster gave away polaroids at Devcon, ENS printed out custom swag, etc.

Please reach out if you want to set up something creative for your next event!

<img width="1440" height="812" alt="collage" src="https://github.com/user-attachments/assets/31ec6d9e-a0f7-4d2c-b91f-d105cc28b080" />

<img width="1440" height="858" alt="Screenshot 2025-08-17 at 1 10 32 AM" src="https://github.com/user-attachments/assets/fb00cffa-14cb-496a-a6cc-25c3ab67a623" />


# How it works

Tools: v0, Cursor, Fujifilm Instax Mini Link 2, Instax Mini Link iOS app

APIs: Replicate, Flux.1 Kontext Pro, Supabase, QR code API, Cloudinary, Next.js

Blockchain: PYUSD, Flow, Dynamic.xyz, Hardhat, Alchemy, MetaMask Mobile

1. Payment Flow: user connects wallet via Dynamic.xyz (email or EOA), then sends $1 PYUSD directly to the event organizer's address using the ERC-20 transfer() function. System generates a unique claim ID, which is then stored in Supabase.

2. Photo Session: user shows their claim ID to the photographer, who uses the admin dashboard to locate the order and initiate the photo-taking process.

3. AI Art Generation: photographer captures photo using web camera and it gets processed through Replicate's Flux.1 Kontext Pro model. The user chooses from 3 art styles: Anime, Graffiti, or Pop Art. Then, a custom QR code (linking to claim page) gets overlaid on the bottom corner, and the final image is saved to the photographer's camera roll.

4. Physical Printing: photographer switches to Instax Mini Link iOS app and prints the AI-enhanced photo on Fujifilm Instax Mini film while the printer is on.

5. NFT Minting: users can later mint their photo as a free NFT on Flow EVM mainnet, with metadata fetched via a Next.js endpoint.

# Stats

- 12+ mainnet transactions via NFT mints on Flow!
- Mainnet address: [0xb861d6d79123ADa308E5F4030F458b402E2D131A](https://evm.flowscan.io/address/0xb861d6d79123ADa308E5F4030F458b402E2D131A)
  - **[NFT collection](https://evm.flowscan.io/token/0xb861d6d79123ADa308E5F4030F458b402E2D131A)**

- Testnet address: [0x49ed9edf4157E02E26207cC648Ef3286F09B2f8e](https://evm-testnet.flowscan.io/address/0x49ed9edf4157E02E26207cC648Ef3286F09B2f8e)
  - [NFT collection](https://evm-testnet.flowscan.io/token/0x49ed9edf4157E02E26207cC648Ef3286F09B2f8e)


<img width="1440" height="780" alt="Screenshot 2025-08-17 at 7 48 13 AM" src="https://github.com/user-attachments/assets/106d6252-df2c-49c9-a387-1df102d608c4" />

<img width="992" height="558" alt="Screenshot 2025-08-17 at 8 12 12 AM" src="https://github.com/user-attachments/assets/647f89df-335a-44b3-904d-fb91868142c5" />

