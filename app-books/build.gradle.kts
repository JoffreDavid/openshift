plugins {
    id("java")
    id("io.quarkus") version "3.37.2"
    id("io.freefair.lombok") version "9.2.0"
}

group = "com.programacion.distribuida"
version = "unspecified"

repositories {
    mavenCentral()
}

val quarkusVersion = "3.35.2"

java {
    sourceCompatibility = JavaVersion.VERSION_25
    targetCompatibility = JavaVersion.VERSION_25
}

dependencies {
    implementation(enforcedPlatform("io.quarkus.platform:quarkus-bom:${quarkusVersion}"))
    //CDI
    implementation("io.quarkus:quarkus-arc")
    //REST
    implementation("io.quarkus:quarkus-rest")
    implementation("io.quarkus:quarkus-rest-jsonb")

    implementation("io.quarkus:quarkus-hibernate-orm")
    implementation("io.quarkus:quarkus-hibernate-orm-panache")
    implementation("io.quarkus:quarkus-jdbc-postgresql")

    //-- Rest Client
    implementation("io.quarkus:quarkus-rest-client-jsonb")
    implementation("io.quarkus:quarkus-rest-client")

    //-- Services Discovery
    implementation("io.quarkus:quarkus-smallrye-stork")
    implementation("io.smallrye.reactive:smallrye-mutiny-vertx-consul-client")
    //implementation("io.smallrye.stork:stork-service-discovery-static-list")
    implementation("io.smallrye.stork:stork-service-discovery-consul")

    implementation("io.quarkus:quarkus-smallrye-fault-tolerance")

    // Telemetria
    implementation("io.quarkus:quarkus-micrometer-registry-prometheus")

    // MicroProfile Health
    implementation("io.quarkus:quarkus-smallrye-health")
}

tasks.test {
    useJUnitPlatform()
}