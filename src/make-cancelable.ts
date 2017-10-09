export default function makeCancelable<T>(promise) {
  let hasCanceled = false;

  const wrappedPromise: CancelablePromise<
    T
  > = new Promise((resolve, reject) => {
    promise
      .then(
        value => (hasCanceled ? reject({ isCanceled: true }) : resolve(value)),
      )
      .catch(
        error => (hasCanceled ? reject({ isCanceled: true }) : reject(error)),
      );
  });

  const cancel = () => {
    hasCanceled = true;
  };

  wrappedPromise.cancel = wrappedPromise.cancel || cancel;

  return wrappedPromise;
}
