package com.sap.sme.ilab.cashflow;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.imagepicker.ImagePickerPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.rnrestartandroid.RNRestartAndroidPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.reactnativenavigation.NavigationApplication;

import org.pgsqlite.SQLitePluginPackage;

public class MainApplication extends NavigationApplication implements ReactApplication {
  @Override
  public boolean isDebug() {
      // Make sure you are using BuildConfig from your own application
      return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
      // Add additional packages you require here
      // No need to add RnnPackage and MainReactPackage
      return Arrays.<ReactPackage>asList(
          // eg. new VectorIconsPackage()
            new SQLitePluginPackage(),
            new SvgPackage(),
            new RNRestartAndroidPackage(),
            new ReactNativeRestartPackage(),
            new RNI18nPackage(),
            new RNVersionCheckPackage(),
            new ImagePickerPackage(),
            new RNFSPackage()
      );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
      return getPackages();
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }
}
