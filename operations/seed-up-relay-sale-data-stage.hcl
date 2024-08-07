job "seed-relay-sale-data" {
  datacenters = ["ator-fin"]
  type = "batch"

  group "seed-relay-sale-data-group" {
    count = 1

    network {
      mode = "bridge"
      port "validator" {
        to = 3000
        host_network = "wireguard"
      }
    }

    task "seed-relay-sale-data-task" {
      driver = "docker"

      resources {
        cpu    = 4096
        memory = 8192
      }

      env {
        CPU_COUNT="1"
      }

      template {
        data = <<EOH
        {{- range service "validator-stage-mongo" }}
          MONGO_URI="mongodb://{{ .Address }}:{{ .Port }}/valid-ator-stage-testnet"
        {{- end }}
        EOH
        destination = "secrets/file.env"
        env         = true
      }

      template {
        change_mode = "noop"
        data = ""
        destination = "local/relay-sale-data.csv"
      }

      config {
        image = "ghcr.io/ator-development/valid-ator:stage"
        volumes = [ "local/relay-sale-data.csv:/data/relay-sale-data.csv" ]
        entrypoint = [ "node" ]
        args = [
          "dist/cli/main.js",
          "seed", "relay-sale-data",
          "--data", "/data/relay-sale-data.csv"
        ]        
      }
    }
  }
}
