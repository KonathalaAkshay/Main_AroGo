# React Native / Hermes
-keep class com.facebook.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.swmansion.** { *; }   # reanimated/gesture-handler
-keep class com.google.gson.** { *; }
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# Keep annotations & signatures
-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod

# If you reflectively access models, keep them (edit package):
# -keep class com.arohago.model.** { *; }

# Remove Log calls in release/minified debug
-assumenosideeffects class android.util.Log { *; }
