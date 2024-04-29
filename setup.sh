#!/usr/bin/env bash

docker compose down -v

docker compose up --build -d --remove-orphans

sleep 5

docker exec -it backend node ace migration:rollback --batch 0

docker exec -it backend node ace migration:run

#docker exec -it backend node ace db:seed --files "./database/seeders/user_seeder.ts"
#docker exec -it backend node ace db:seed --files "./database/seeders/client_seeder.ts"
#docker exec -it backend node ace db:seed --files "./database/seeders/bank_detail_seeder.ts"
#docker exec -it backend node ace db:seed --files "./database/seeders/invoice_item_seeder.ts"
#docker exec -it backend node ace db:seed --files "./database/seeders/product_service_seeder.ts"
#docker exec -it backend node ace db:seed --files "./database/seeders/invoice_seeder.ts"
#docker exec -it backend node ace db:seed --files "./database/seeders/tax_information_seeder.ts"
#docker exec -it backend node ace db:seed --files "./database/seeders/public_business_datum_seeder.ts"
#docker exec -it backend node ace db:seed --files "./database/seeders/plan_seeder.ts"
#docker exec -it backend node ace db:seed --files "./database/seeders/payment_seeder.ts"
#docker exec -it backend node ace db:seed --files "./database/seeders/order_seeder.ts"
