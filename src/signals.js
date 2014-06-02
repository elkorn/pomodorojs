function handleSignal(signal) {
    return function(handler) {
        process.on(signal, handler);
    };
}

exports.onInterrupt = handleSignal("SIGINT"); 
exports.onTerminate = handleSignal("SIGTERM"); 
