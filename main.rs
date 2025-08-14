use axum::{
    routing::post,
    extract::{State},
    response::IntoResponse,
    Json, Router,
};
use serde::Deserialize;
use std::sync::{Arc, Mutex};

#[derive(Debug, Deserialize)]
struct MintRequest {
    amount: u64,
}

#[derive(Debug, Default)]
struct TokenMeta {
    total_supply: u64,
}

#[derive(Default)]
struct AppState {
    meta: TokenMeta,
}

async fn mint_tokens(
    State(state): State<Arc<Mutex<AppState>>>,
    Json(payload): Json<MintRequest>,
) -> impl IntoResponse {
    let mut app_state = state.lock().unwrap();
    app_state.meta.total_supply += payload.amount;
    Json(app_state.meta.total_supply)
}

#[tokio::main]
async fn main() {
    let state = Arc::new(Mutex::new(AppState::default()));

    let app = Router::new()
        .route("/mint", post(mint_tokens))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}
