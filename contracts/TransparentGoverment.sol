pragma solidity ^0.5.10;

contract TransparentGoverment {
    
    struct Document {
        address owner;
        uint date;
    }
    
    struct Verify {
        address VerifyBy;
        address DocumentOwner;
        bool verifyStatus;
    }
    
    // Mapping Document Hash with its Status
    mapping(bytes32 => Verify) public documentVerifiedStatus;
    
    // Mapping ID with govBodiesaddress 
    mapping(string => address) govBodiesMappingID;
    
    // Mapping name with govBodiesaddress
    mapping(string => address) govBodiesMappingName;

    
    address public creator;
    uint public numDocuments;
    mapping(bytes32 => Document) public documentHashMap;
    
    constructor() public {
        creator = msg.sender;
        numDocuments = 0;
    }



      function govBodies(string memory id, address govbodies, string memory  name) public {
          require(msg.sender == creator);
          if(govBodiesMappingID[id] == 0x0000000000000000000000000000000000000000){
                govBodiesMappingID[id] = govbodies;
                govBodiesMappingName[name] = govbodies;
              
          }
          else {
              revert("Already Exist");
          }
      }
      
       function getGovBodies(string memory id)public view returns(address){
        return govBodiesMappingID[id];
    }
    
    
    function newDocument(bytes32 hash, string memory id) public returns (bool success) {
        require(msg.sender == govBodiesMappingID[id]) ;
        
        if (documentExists(hash)) {
            success = false;
        }else {
            Document storage d = documentHashMap[hash];
            d.owner = msg.sender;
            d.date = now;
            numDocuments++;
            success = true;
        }
        return success;
    }
    
    function documentExists(bytes32 hash) public view returns (bool exists) {
        if (documentHashMap[hash].date > 0) {
            exists = true;
        } else {
            exists = false;
        }
        return exists;
    }
    
    function getDocument(bytes32 hash) public view returns (uint date, address owner) {
        date = documentHashMap[hash].date;
        owner = documentHashMap[hash].owner;
    }

    function getNumDocs() public view returns (uint numDocs) {
        return numDocuments;
    }
    
    function verifyDocumentOfUser(bytes32 hash,string memory govBodiesid,address documentOwner) public{
        require(msg.sender == govBodiesMappingID[govBodiesid] ) ;
         Verify storage d = documentVerifiedStatus[hash];
            d.VerifyBy = govBodiesMappingID[govBodiesid];
            d.DocumentOwner = documentOwner;
            d.verifyStatus = true;
    }
}