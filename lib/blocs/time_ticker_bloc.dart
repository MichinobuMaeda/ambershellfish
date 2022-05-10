import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class TimeTickerBlocEvent {}

class TimeTickerBloc extends Bloc<TimeTickerBlocEvent, DateTime> {
  final Duration _interval;
  Timer? _timer;
  VoidCallback? onTick;

  TimeTickerBloc({
    Duration? interval,
    this.onTick,
    bool start = true,
  })  : _interval = interval ?? const Duration(seconds: 1),
        super(DateTime.now()) {
    on<TimeTickerBlocEvent>(
      (_, emit) {
        emit(DateTime.now());
        if (onTick != null) onTick!();
      },
    );

    if (start) activate();
  }

  void activate() {
    _timer = Timer.periodic(
      _interval,
      (_) {
        add(TimeTickerBlocEvent());
      },
    );
  }

  @override
  Future<void> close() async {
    _timer?.cancel();
    await super.close();
  }
}
