// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// importing the ERC-721 contract to deploy for an artist
import "./Collection.sol";

/**
 * @notice Give the ability to deploy a contract to manage ERC-721 tokens for an Artist. S/O @Snow
 * @dev    If the contract is already deployed for an _artistName, it will revert.
 */
contract CollectionFactory {
    struct ArtistCollection {
        address collectionAddress;
        address owner;
        string name;
        string symbol;
    }

    ArtistCollection[] public collectionsCreated;

    event collectionCreated(
        address _collectionAddress,
        address _owner,
        string _artistName,
        string _artistSymbol
    );

    /**
     * @notice Deploy the ERC-721 Collection contract of the artist caller to be able to create NFTs later
     *
     * @return collectionAddress the address of the created collection contract
     */
    function createNFTCollection(
        string memory _artistName,
        string memory _artistSymbol
    ) external returns (address collectionAddress) {
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = type(Collection).creationCode;
        // Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(_artistName));

        assembly {
            collectionAddress := create2(
                0,
                add(collectionBytecode, 0x20),
                mload(collectionBytecode),
                salt
            )
            if iszero(extcodesize(collectionAddress)) {
                // revert if something gone wrong (collectionAddress doesn't contain an address)
                revert(0, 0)
            }
        }
        // Initialize the collection contract with the artist settings
        Collection(collectionAddress).initialize(_artistName, _artistSymbol, msg.sender);

        ArtistCollection memory collection;
        collection.collectionAddress = collectionAddress;
        collection.name = _artistName;
        collection.owner = msg.sender;
        collection.symbol = _artistSymbol;
        collectionsCreated.push(collection);
        emit collectionCreated(
            collectionAddress,
            msg.sender,
            _artistName,
            _artistSymbol
        );
    }

    function getOneCollection(uint256 _idCollection)
        external
        view
        returns (ArtistCollection memory)
    {
        return collectionsCreated[_idCollection];
    }
}
