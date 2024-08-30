import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Wallet } from "zksync-ethers";
import { Deployer } from "@matterlabs/hardhat-zksync";
import * as ethers from 'ethers';
import { verifyContract, deployContract } from "./utils";




const deployContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {


  const { deployer } = await hre.getNamedAccounts();


  const artifact = await hre.artifacts.readArtifact("Hash");


  console.log("Deploying...");

  await hre.deployments.deploy("Hash", {
    from: deployer,
    args: [],
    log: true,
    libraries: {
      PoseidonT3: "0x1447872E09b36eB3Bc49cF930c47175Da46139fE",
      PoseidonT4: "0x1447872E09b36eB3Bc49cF930c47175Da46139fE",
      PoseidonT5: "0x1447872E09b36eB3Bc49cF930c47175Da46139fE",
      PoseidonT6: "0x1447872E09b36eB3Bc49cF930c47175Da46139fE",
    },
    gasLimit: 500000000,
  });
  console.log(`contract.....`);

  const hash = await hre.ethers.getContract(
    "Hash",
    deployer
  );

  const contractInterface = new ethers.Interface(artifact.abi);
  const encodedConstructorArgs = contractInterface.encodeDeploy(args);

  console.log(`The MACI contract is deployed at ${await hash.getAddress()}`);


  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  const address = await hash.getAddress();

  // Log deployment info
  console.log(`\n"${artifact.contractName}" was successfully deployed:`);
  console.log(` - Contract address: ${address}`);
  console.log(` - Contract source: ${fullContractSource}`);
  console.log(` - Encoded constructor arguments: ${encodedConstructorArgs}\n`);

  // Verify the contract
  console.log(`Requesting contract verification...`);
  await verifyContract({
    address,
    contract: fullContractSource,
    constructorArguments: encodedConstructorArgs,
    bytecode: artifact.bytecode,
  });

};



// async function deployContracts(hre: HardhatRuntimeEnvironment) {
//   console.log("Starting deployment process...");

//   const wallet = new Wallet(String(process.env.DEPLOYER_PRIVATE_KEY));
//   console.log("Wallet created.");

//   const deployer = new Deployer(hre, wallet);
//   console.log("Deployer instance created.");

//   async function deployLibrary(name: string) {
//     console.log(`Deploying ${name}...`);
//     const artifact = await deployer.loadArtifact(name);
//     const library = await deployer.deploy(artifact);
//     console.log(`${name} deployed to ${await library.getAddress()}`);
//     return library;
//   }

//   const poseidonT3 = await deployLibrary("PoseidonT3");
//   const poseidonT4 = await deployLibrary("PoseidonT4");
//   const poseidonT5 = await deployLibrary("PoseidonT5");
//   const poseidonT6 = await deployLibrary("PoseidonT6");

//   console.log("All Poseidon libraries deployed.");

//   // Load the Hash contract artifact
//   console.log("Loading Hash contract artifact...");
//   const artifact = await deployer.loadArtifact("Hash");
//   console.log("Hash contract artifact loaded.");

//   // Prepare the libraries object
//   const libraries = {
//     ["contracts/crypto/PoseidonT3.sol:PoseidonT3"]: await poseidonT3.getAddress(),
//     ["contracts/crypto/PoseidonT4.sol:PoseidonT4"]: await poseidonT4.getAddress(),
//     ["contracts/crypto/PoseidonT5.sol:PoseidonT5"]: await poseidonT5.getAddress(),
//     ["contracts/crypto/PoseidonT6.sol:PoseidonT6"]: await poseidonT6.getAddress(),
//   };

//   console.log("Libraries object prepared:", libraries);

//   // Manually link libraries
//   let bytecode = artifact.bytecode;
//   for (const [libName, libAddress] of Object.entries(libraries)) {
//     const placeholder = `__$${hre.ethers.keccak256(hre.ethers.toUtf8Bytes(libName)).slice(2, 36)}$__`;
//     bytecode = bytecode.replace(new RegExp(placeholder, 'g'), libAddress.slice(2));
//   }
//   console.log("Libraries manually linked to bytecode.");

//   // Deploy the Hash contract with linked bytecode
//   console.log("Deploying Hash contract...");
//   try {
//     const factory = new ethers.ContractFactory(artifact.abi, bytecode, wallet);
//     const hashContract = await deployer.deploy(factory);
//     const contractAddress = await hashContract.getAddress();
//     console.log(`Hash contract deployed to ${contractAddress}`);

//     // Verify the contract
//     console.log("Verifying contract...");
//     await hre.run("verify:verify", {
//       address: contractAddress,
//       constructorArguments: [],
//       libraries: libraries
//     });
//     console.log("Contract verified successfully.");
//   } catch (error) {
//     console.error("Error during deployment:", error);
//     throw error;
//   }
// }

export default deployContracts;

deployContracts.tags = ["Hash"];
