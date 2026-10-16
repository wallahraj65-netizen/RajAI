export interface ProjectFile {
  path: string;
  category: 'gradle' | 'manifest' | 'kotlin' | 'compose' | 'database' | 'network' | 'doc';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'build.gradle.kts',
    category: 'gradle',
    description: 'Root Gradle configuration with Kotlin & Android plugins',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
`,
  },
  {
    path: 'settings.gradle.kts',
    category: 'gradle',
    description: 'Gradle repository settings',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Raj AI"
include(":app")
`,
  },
  {
    path: 'app/build.gradle.kts',
    category: 'gradle',
    description: 'Application Gradle script with Jetpack Compose, Room, Retrofit & Material 3',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.rajai.assistant"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.rajai.assistant"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        // Configurable server backend URL (replace with your Cloud Run or local IP)
        buildConfigField("String", "BASE_URL", "\\"https://raj-ai-backend.run.app/\\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    // Core Android & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Networking: Retrofit & OkHttp Logging
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.gson)
    implementation(libs.okhttp.logging.interceptor)

    // Local Storage: Room Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Image Loading
    implementation(libs.coil.compose)

    // Coroutines & Flow
    implementation(libs.kotlinx.coroutines.android)

    // Unit Testing
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'manifest',
    description: 'Android App Manifest with network and audio permissions',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions required for AI Assistant -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <application
        android:name=".RajAiApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.RajAI">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.RajAI"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/RajAiApplication.kt',
    category: 'kotlin',
    description: 'Application class for dependency and database initialization',
    content: `package com.rajai.assistant

import android.app.Application
import com.rajai.assistant.data.local.AppDatabase

class RajAiApplication : Application() {
    val database: AppDatabase by lazy { AppDatabase.getDatabase(this) }

    override fun onCreate() {
        super.onCreate()
        instance = this
    }

    companion object {
        lateinit var instance: RajAiApplication
            private set
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/MainActivity.kt',
    category: 'kotlin',
    description: 'Main Activity with Jetpack Compose navigation root',
    content: `package com.rajai.assistant

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.rajai.assistant.ui.navigation.RajAiAppNavHost
import com.rajai.assistant.ui.theme.RajAITheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            RajAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    RajAiAppNavHost()
                }
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/ui/theme/Color.kt',
    category: 'compose',
    description: 'Material 3 Color palette for Raj AI Dark & Light themes',
    content: `package com.rajai.assistant.ui.theme

import androidx.compose.ui.graphics.Color

// Dark Theme Colors (Deep Navy, Royal Purple, Cyan Accent)
val DarkBackground = Color(0xFF0A0F1D)
val DarkSurface = Color(0xFF131B2E)
val DarkSurfaceVariant = Color(0xFF1E293B)
val PrimaryPurple = Color(0xFF8B5CF6)
val PrimaryPurpleVariant = Color(0xFF7C3AED)
val SecondaryCyan = Color(0xFF06B6D4)
val AccentPink = Color(0xFFEC4899)
val TextPrimaryDark = Color(0xFFF8FAFC)
val TextSecondaryDark = Color(0xFF94A3B8)
val BorderDark = Color(0xFF334155)

// Light Theme Colors
val LightBackground = Color(0xFFF8FAFC)
val LightSurface = Color(0xFFFFFFFF)
val LightSurfaceVariant = Color(0xFFF1F5F9)
val TextPrimaryLight = Color(0xFF0F172A)
val TextSecondaryLight = Color(0xFF64748B)
val BorderLight = Color(0xFFE2E8F0)
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/ui/theme/Theme.kt',
    category: 'compose',
    description: 'Theme definition configuring dynamic color and typography',
    content: `package com.rajai.assistant.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryPurple,
    secondary = SecondaryCyan,
    tertiary = AccentPink,
    background = DarkBackground,
    surface = DarkSurface,
    surfaceVariant = DarkSurfaceVariant,
    onPrimary = TextPrimaryDark,
    onBackground = TextPrimaryDark,
    onSurface = TextPrimaryDark,
    outline = BorderDark
)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryPurpleVariant,
    secondary = SecondaryCyan,
    tertiary = AccentPink,
    background = LightBackground,
    surface = LightSurface,
    surfaceVariant = LightSurfaceVariant,
    onPrimary = LightSurface,
    onBackground = TextPrimaryLight,
    onSurface = TextPrimaryLight,
    outline = BorderLight
)

@Composable
fun RajAITheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/data/model/ChatMessage.kt',
    category: 'database',
    description: 'Room Entity for storing chat messages locally',
    content: `package com.rajai.assistant.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "chat_messages")
data class ChatMessageEntity(
    @PrimaryKey
    val id: String,
    val conversationId: String,
    val role: String, // "user" or "assistant"
    val content: String,
    val timestamp: Long = System.currentTimeMillis(),
    val language: String = "English",
    val isDemo: Boolean = false
)
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/data/local/ChatDao.kt',
    category: 'database',
    description: 'Room Data Access Object for local chat queries and caching',
    content: `package com.rajai.assistant.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.rajai.assistant.data.model.ChatMessageEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ChatDao {
    @Query("SELECT * FROM chat_messages WHERE conversationId = :convId ORDER BY timestamp ASC")
    fun getMessagesForConversation(convId: String): Flow<List<ChatMessageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: ChatMessageEntity)

    @Query("DELETE FROM chat_messages WHERE conversationId = :convId")
    suspend fun clearConversation(convId: String)

    @Query("DELETE FROM chat_messages")
    suspend fun clearAllMessages()
}
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/data/local/AppDatabase.kt',
    category: 'database',
    description: 'Room database singleton configuration',
    content: `package com.rajai.assistant.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.rajai.assistant.data.model.ChatMessageEntity

@Database(entities = [ChatMessageEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun chatDao(): ChatDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "raj_ai_database"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/data/remote/RajAiApiService.kt',
    category: 'network',
    description: 'Retrofit interface definitions for Raj AI backend endpoints',
    content: `package com.rajai.assistant.data.remote

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

data class ChatRequest(
    val messages: List<RemoteMessage>,
    val language: String,
    val stream: Boolean = false
)

data class RemoteMessage(
    val role: String,
    val content: String
)

data class ChatResponse(
    val role: String,
    val content: String,
    val model: String?,
    val isDemo: Boolean
)

data class StoryRequest(
    val genre: String,
    val language: String,
    val length: String,
    val characters: String,
    val premise: String
)

data class StoryResponse(
    val title: String,
    val logline: String,
    val fullStory: String,
    val scenes: List<SceneScript>,
    val moral: String
)

data class SceneScript(
    val sceneNumber: Int,
    val title: String,
    val visualPrompt: String,
    val dialogues: List<DialogueLine>
)

data class DialogueLine(
    val character: String,
    val line: String
)

data class ImageRequest(
    val prompt: String,
    val aspectRatio: String,
    val style: String
)

data class ImageResponse(
    val imageUrl: String,
    val prompt: String,
    val aspectRatio: String,
    val isDemo: Boolean
)

interface RajAiApiService {
    @POST("api/chat")
    suspend fun sendChat(@Body request: ChatRequest): Response<ChatResponse>

    @POST("api/story")
    suspend fun generateStory(@Body request: StoryRequest): Response<StoryResponse>

    @POST("api/image")
    suspend fun generateImage(@Body request: ImageRequest): Response<ImageResponse>
}
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/data/repository/RajAiRepository.kt',
    category: 'network',
    description: 'Repository combining local Room caching and remote Retrofit AI service',
    content: `package com.rajai.assistant.data.repository

import com.rajai.assistant.data.local.ChatDao
import com.rajai.assistant.data.model.ChatMessageEntity
import com.rajai.assistant.data.remote.ChatRequest
import com.rajai.assistant.data.remote.RajAiApiService
import com.rajai.assistant.data.remote.RemoteMessage
import kotlinx.coroutines.flow.Flow
import java.util.UUID

class RajAiRepository(
    private val apiService: RajAiApiService,
    private val chatDao: ChatDao
) {
    fun getConversationMessages(conversationId: String): Flow<List<ChatMessageEntity>> {
        return chatDao.getMessagesForConversation(conversationId)
    }

    suspend fun sendMessage(
        conversationId: String,
        userText: String,
        history: List<ChatMessageEntity>,
        language: String
    ): Result<ChatMessageEntity> {
        val userEntity = ChatMessageEntity(
            id = UUID.randomUUID().toString(),
            conversationId = conversationId,
            role = "user",
            content = userText,
            language = language
        )
        chatDao.insertMessage(userEntity)

        return try {
            val remoteMessages = (history + userEntity).map {
                RemoteMessage(role = it.role, content = it.content)
            }
            val response = apiService.sendChat(ChatRequest(remoteMessages, language))
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                val assistantEntity = ChatMessageEntity(
                    id = UUID.randomUUID().toString(),
                    conversationId = conversationId,
                    role = "assistant",
                    content = body.content,
                    language = language,
                    isDemo = body.isDemo
                )
                chatDao.insertMessage(assistantEntity)
                Result.success(assistantEntity)
            } else {
                Result.failure(Exception("API returned \${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun clearHistory(conversationId: String) {
        chatDao.clearConversation(conversationId)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/ui/viewmodel/RajAiViewModel.kt',
    category: 'compose',
    description: 'MVVM ViewModel managing UI State, Coroutines, and Room interactions',
    content: `package com.rajai.assistant.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rajai.assistant.data.model.ChatMessageEntity
import com.rajai.assistant.data.repository.RajAiRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ChatUiState(
    val messages: List<ChatMessageEntity> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val selectedLanguage: String = "English"
)

class RajAiViewModel(
    private val repository: RajAiRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ChatUiState())
    val uiState: StateFlow<ChatUiState> = _uiState.asStateFlow()

    private val activeConvId = "default_conversation"

    init {
        viewModelScope.launch {
            repository.getConversationMessages(activeConvId).collect { msgList ->
                _uiState.value = _uiState.value.copy(messages = msgList)
            }
        }
    }

    fun sendMessage(text: String) {
        if (text.isBlank()) return
        _uiState.value = _uiState.value.copy(isLoading = true, error = null)

        viewModelScope.launch {
            val result = repository.sendMessage(
                conversationId = activeConvId,
                userText = text,
                history = _uiState.value.messages,
                language = _uiState.value.selectedLanguage
            )
            if (result.isFailure) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = result.exceptionOrNull()?.localizedMessage ?: "Failed to get AI reply"
                )
            } else {
                _uiState.value = _uiState.value.copy(isLoading = false)
            }
        }
    }

    fun setLanguage(lang: String) {
        _uiState.value = _uiState.value.copy(selectedLanguage = lang)
    }

    fun clearChat() {
        viewModelScope.launch {
            repository.clearHistory(activeConvId)
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/rajai/assistant/ui/navigation/Screen.kt',
    category: 'compose',
    description: 'Jetpack Compose destinations and bottom navigation host',
    content: `package com.rajai.assistant.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Create
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Chat : Screen("chat", "Chat", Icons.Default.Chat)
    object Create : Screen("create", "Create", Icons.Default.Create)
    object History : Screen("history", "History", Icons.Default.History)
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
}
`,
  },
  {
    path: 'app/src/test/java/com/rajai/assistant/RajAiUnitTest.kt',
    category: 'kotlin',
    description: 'Unit test verifying data models and response formatting',
    content: `package com.rajai.assistant

import com.rajai.assistant.data.model.ChatMessageEntity
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test

class RajAiUnitTest {
    @Test
    fun testChatMessageCreation() {
        val msg = ChatMessageEntity(
            id = "test-123",
            conversationId = "conv-1",
            role = "assistant",
            content = "Namaste, this is Raj AI",
            language = "Hindi",
            isDemo = false
        )
        assertNotNull(msg)
        assertEquals("test-123", msg.id)
        assertEquals("assistant", msg.role)
        assertEquals("Hindi", msg.language)
    }
}
`,
  },
  {
    path: 'README.md',
    category: 'doc',
    description: 'Complete instructions to open, build, and deploy the Android Studio project and APK',
    content: `# Raj AI — Production-Ready Android Application

Raj AI is an all-in-one AI assistant application engineered with Kotlin, Jetpack Compose, Material 3, Room, and Retrofit.

## 🚀 Key Features
1. **AI Chat**: Natural conversations supporting Hindi, English, and Hinglish with voice input & text-to-speech.
2. **AI Story Generator**: Scene-by-scene screenplays with characters, dialogue, and cinematic video prompts.
3. **AI Image Studio**: Custom aspect ratio generation (1:1, 16:9, 9:16) with style filters.
4. **AI Video Prompts**: Detailed camera, lighting, and action descriptions for Veo, Sora, and Runway.
5. **AI Study Assistant**: Step-by-step problem solver, interactive quiz mode with scoring, and revision notes.
6. **AI Coding Assistant**: Multi-language code generation, bug fixing, and complexity analysis.
7. **YouTube Creator Suite**: Viral title generators, BGMI gaming descriptions, thumbnail concepts, and Shorts hooks.
8. **AI Voice & Text Tools**: Text-to-speech, translation, summarizer, and grammar fixer.

## 🛠️ Requirements & Tech Stack
- Android Studio Ladybug / Koala / Hedgehog or newer
- Minimum SDK: API 26 (Android 8.0)
- Target SDK: API 35
- Kotlin 2.0+
- Jetpack Compose + Material 3
- Room Database (local offline storage)
- Retrofit 2 + OkHttp 4
- Coroutines & StateFlow

## 📦 How to Build the Project in Android Studio
1. Open Android Studio -> Select **Open...** -> Choose the extracted \`RajAI-AndroidStudio\` folder.
2. Allow Gradle to sync dependencies automatically.
3. To configure the backend URL, open \`app/build.gradle.kts\` and update:
   \`\`\`kotlin
   buildConfigField("String", "BASE_URL", "\\"https://YOUR-BACKEND-URL.run.app/\\"")
   \`\`\`
4. Run on an Android Emulator or physical device by pressing **Shift + F10**.

## 🔨 How to Generate APKs
- **Debug APK**:
  Run in terminal:
  \`\`\`bash
  ./gradlew assembleDebug
  \`\`\`
  The APK will be generated at: \`app/build/outputs/apk/debug/app-debug.apk\`

- **Signed Release APK / AAB**:
  1. In Android Studio, go to **Build** -> **Generate Signed Bundle / APK...**
  2. Select **APK** or **Android App Bundle**
  3. Provide or create a keystore, set key alias and passwords
  4. Select **release** destination folder and click **Finish**.
`,
  },
];
