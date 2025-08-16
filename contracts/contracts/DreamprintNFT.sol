// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DreamprintNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId = 1;
    string private _baseMetadataURI;

    // Mapping from claim ID to token ID (for tracking minted claims)
    mapping(string => uint256) public claimToTokenId;
    // Mapping from token ID to claim ID
    mapping(uint256 => string) public tokenIdToClaim;
    // Mapping to track if a claim has been minted
    mapping(string => bool) public claimMinted;

    event NFTMinted(
        address indexed to,
        uint256 indexed tokenId,
        string claimId
    );
    event MetadataURIUpdated(string newBaseURI);

    constructor(
        string memory _initialBaseURI
    ) 
        ERC721("Dreamprint", "DREAM") 
        Ownable(0xB68918211aD90462FbCf75b77a30bF76515422CE) 
    {
        _baseMetadataURI = _initialBaseURI;
    }

    /// @notice Mint NFT for a specific claim (free, only gas fees)
    /// @param claimId The unique claim identifier from your database
    /// @param to The address to mint the NFT to
    function mint(string memory claimId, address to) external {
        require(bytes(claimId).length > 0, "Claim ID cannot be empty");
        require(to != address(0), "Cannot mint to zero address");
        require(!claimMinted[claimId], "Claim already minted");

        // Mint the NFT
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        // Store claim mapping
        claimToTokenId[claimId] = tokenId;
        tokenIdToClaim[tokenId] = claimId;
        claimMinted[claimId] = true;

        emit NFTMinted(to, tokenId, claimId);
    }

    /// @notice Mint NFT (owner only) - for admin purposes
    /// @param claimId The unique claim identifier from your database
    /// @param to The address to mint the NFT to
    function adminMint(string memory claimId, address to) external onlyOwner {
        require(bytes(claimId).length > 0, "Claim ID cannot be empty");
        require(to != address(0), "Cannot mint to zero address");
        require(!claimMinted[claimId], "Claim already minted");

        // Mint the NFT
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        // Store claim mapping
        claimToTokenId[claimId] = tokenId;
        tokenIdToClaim[tokenId] = claimId;
        claimMinted[claimId] = true;

        emit NFTMinted(to, tokenId, claimId);
    }

    /// @notice Get token URI - uses your metadata API
    /// @param tokenId The token ID to get metadata for
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        string memory claimId = tokenIdToClaim[tokenId];
        require(bytes(claimId).length > 0, "No claim ID for token");
        
        // Return metadata API URL: /api/metadata/[claimId]/[tokenId]
        return string(abi.encodePacked(
            _baseMetadataURI,
            "/api/metadata/",
            claimId,
            "/",
            tokenId.toString()
        ));
    }

    /// @notice Update the base metadata URI (owner only)
    /// @param newBaseURI The new base URI for metadata
    function setBaseMetadataURI(string memory newBaseURI) external onlyOwner {
        _baseMetadataURI = newBaseURI;
        emit MetadataURIUpdated(newBaseURI);
    }

    /// @notice Get the base metadata URI
    function getBaseMetadataURI() external view returns (string memory) {
        return _baseMetadataURI;
    }

    /// @notice Check if a claim has been minted
    /// @param claimId The claim ID to check
    function isClaimMinted(string memory claimId) external view returns (bool) {
        return claimMinted[claimId];
    }

    /// @notice Get token ID for a claim
    /// @param claimId The claim ID to look up
    function getTokenIdForClaim(string memory claimId) external view returns (uint256) {
        require(claimMinted[claimId], "Claim not minted");
        return claimToTokenId[claimId];
    }

    /// @notice Get claim ID for a token
    /// @param tokenId The token ID to look up
    function getClaimForTokenId(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenIdToClaim[tokenId];
    }

    /// @notice Get the next token ID that will be minted
    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    /// @notice Get total number of tokens minted
    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }



    // Required overrides for ERC721URIStorage
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
