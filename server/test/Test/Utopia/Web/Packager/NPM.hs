{-# LANGUAGE OverloadedStrings #-}

module Test.Utopia.Web.Packager.NPM where

import Conduit
import Control.Lens
import qualified Data.HashMap.Strict     as Map
import Data.List (stripPrefix)
import Data.Text (pack)
import           Protolude
import           System.Directory
import           System.FilePath
import           Test.Hspec
import           Utopia.Web.Packager.NPM

expectedFilenames :: [Text]
expectedFilenames = [
  "/node_modules/js-tokens/index.js",
  "/node_modules/js-tokens/package.json",
  "/node_modules/loose-envify/cli.js",
  "/node_modules/loose-envify/custom.js",
  "/node_modules/loose-envify/index.js",
  "/node_modules/loose-envify/loose-envify.js",
  "/node_modules/loose-envify/package.json",
  "/node_modules/loose-envify/replace.js",
  "/node_modules/object-assign/index.js",
  "/node_modules/object-assign/package.json",
  "/node_modules/prop-types/checkPropTypes.js",
  "/node_modules/prop-types/factory.js",
  "/node_modules/prop-types/factoryWithThrowingShims.js",
  "/node_modules/prop-types/factoryWithTypeCheckers.js",
  "/node_modules/prop-types/index.js",
  "/node_modules/prop-types/lib/ReactPropTypesSecret.js",
  "/node_modules/prop-types/package.json",
  "/node_modules/prop-types/prop-types.js",
  "/node_modules/prop-types/prop-types.min.js",
  "/node_modules/react-is/cjs/react-is.development.js",
  "/node_modules/react-is/cjs/react-is.production.min.js",
  "/node_modules/react-is/index.js",
  "/node_modules/react-is/package.json",
  "/node_modules/react-is/umd/react-is.development.js",
  "/node_modules/react-is/umd/react-is.production.min.js",
  "/node_modules/react/cjs/react.development.js",
  "/node_modules/react/cjs/react.production.min.js",
  "/node_modules/react/index.js",
  "/node_modules/react/package.json",
  "/node_modules/react/umd/react.development.js",
  "/node_modules/react/umd/react.production.min.js",
  "/node_modules/react/umd/react.profiling.min.js"]

getNodeModulesSubDirectories :: FilePath -> ConduitT () FilePath (ResourceT IO) ()
getNodeModulesSubDirectories projectFolder = 
  let targetDir = projectFolder </> "node_modules"
   in mapOutput (\path -> fromMaybe path $ stripPrefix (targetDir <> "/") path) $ sourceDirectory targetDir

npmSpec :: Spec
npmSpec = do
  describe "withInstalledProject" $ do
    it "should have the various dependencies in node_modules for react" $ do
      semaphore <- newQSem 1
      result <- runResourceT $ sourceToList $ withInstalledProject semaphore "react@16.13.1" getNodeModulesSubDirectories
      (sort result) `shouldBe` [".bin", "js-tokens", "loose-envify", "object-assign", "prop-types", "react", "react-is"]
    it "should fail for a non-existent project" $ do
      semaphore <- newQSem 1
      (runResourceT $ sourceToList $ withInstalledProject semaphore "non-existent-project-that-will-never-exist@9.9.9.9.9.9" getNodeModulesSubDirectories) `shouldThrow` anyIOException
  describe "getModuleAndDependenciesFiles" $ do
    it "should get a bunch of .js, .d.ts and package.json files" $ do
      semaphore <- newQSem 1
      result <- runResourceT $ sourceToList $ withInstalledProject semaphore "react@16.13.1" getModuleAndDependenciesFiles
      let filteredResult = filter (\(k, v) -> v /= encodedPlaceholder) result
      let sortedFilenames = sort $ fmap pack $ toListOf (traverse . _1) filteredResult
      sortedFilenames `shouldBe` expectedFilenames
